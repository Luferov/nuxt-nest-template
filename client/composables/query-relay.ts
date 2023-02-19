import type { ComputedRef } from 'vue'
import { computed, onMounted, watch } from 'vue'
import type { ApolloQueryResult, DataProxy } from '@apollo/client'
import type { FetchResult } from '@apollo/client/link/core'
import { OperationVariables } from '@apollo/client/core'
import type { DocumentNode } from 'graphql'
import type { DocumentParameter, OptionsParameter, UseQueryReturn } from '@vue/apollo-composable/dist/useQuery'
import type { UseResultReturn } from '@vue/apollo-composable/dist/useResult'
import type { ExtractSingleKey } from '@vue/apollo-composable/dist/util/ExtractSingleKey'

import { InvariantError } from 'ts-invariant'
import { useQuery } from '@vue/apollo-composable'
import { useEventListener } from '@vueuse/core'
import { getValue, VT } from '~/services/graphql-relay'
import { useOffsetPagination } from '~/composables/pagination'
import { useResult } from '~/composables/query-result'

import type { PageInfo, PaginationInterface } from '~/types/pagination'

export type ResultDefaultValueType<TNode> = {
  totalCount: number
  edges: { node: TNode }[]
  pageInfo?: PageInfo
}

export type TransformUpdate<TResultQuery, TResultMutation> = (
  data: TResultQuery,
  result?: Omit<FetchResult<TResultMutation>, 'context'>
) => TResultQuery

export type QueryRelayParams<TResult = any, TVariables = any> = {
  document: DocumentParameter<TResult, TVariables>
  variables?: VT<TVariables>
  options: OptionsParameter<TResult, TVariables>
}

export type QueryRelayOptions = {
  pagination: PaginationInterface
  isScrollDown?: boolean
  fetchScrollTrigger?: number
  fetchScroll?: Document | HTMLElement | undefined
}

export type UseResultDefaultValueType<TNode> = { totalCount: number; edges: { node: TNode }[] }

export type QueryRelayResult<
  TResult = any,
  TVariables = any,
  TNode extends { id: string | number } = any
> = UseQueryReturn<TResult, TVariables> & {
  dataQuery: UseResultReturn<UseResultDefaultValueType<TNode> | ExtractSingleKey<NonNullable<TResult>>>
  data: ComputedRef<TNode[]>
  pagination: PaginationInterface
  fetchMoreAvailable: ComputedRef<boolean>
  fetchMoreData: () => void
  update: <TResultMutation>(
    cache: DataProxy,
    result: Omit<FetchResult<TResultMutation>, 'context'>,
    transform: TransformUpdate<TResult, TResultMutation>,
    isStrict: boolean
  ) => void
  addUpdate: <TResultMutation>(
    cache: DataProxy,
    result: Omit<FetchResult<TResultMutation>, 'context'>,
    key?: string | null
  ) => void
  changeUpdate: <TResultMutation>(
    cache: DataProxy,
    result: Omit<FetchResult<TResultMutation>, 'context'>,
    key?: string | null
  ) => void
  deleteUpdate: <TResultMutation>(
    cache: DataProxy,
    result: Omit<FetchResult<TResultMutation>, 'context'>,
    isStrict?: boolean
  ) => void
}

export function useQueryRelay<
  TResult extends Record<string, any> = any,
  TVariables extends OperationVariables = any,
  TNode extends { id: string | number } = any
>(
  queryParams: QueryRelayParams<TResult, TVariables>,
  queryOptions: QueryRelayOptions = {
    pagination: useOffsetPagination(),
  }
): QueryRelayResult<TResult, TVariables, TNode> {
  const { document: documentNode, variables = {}, options = {} } = queryParams
  const { pagination, fetchScroll } = queryOptions
  const isScrollDown = queryOptions.isScrollDown ?? true
  const fetchScrollTrigger = queryOptions.fetchScrollTrigger ?? 200

  /**
   * Переменные запроса
   */
  const queryVariables = computed<TVariables>(() => {
    return { ...pagination.variables.value, ...getValue<TVariables>(variables) }
  })

  /**
   * Запросы
   */
  const q = useQuery<TResult, TVariables>(documentNode, queryVariables, options)
  const dataQuery = useResult<TResult, ResultDefaultValueType<TNode>>(q.result, { totalCount: 0, edges: [] })

  /**
   * Чистые данные
   */
  const data = computed<TNode[]>(() => {
    const { totalCount, pageInfo, edges } = dataQuery.value as unknown as {
      totalCount: number
      edges: { node: TNode }[]
      pageInfo?: PageInfo
    }
    pagination.setQueryInfo(totalCount, edges.length, pageInfo)
    if (pagination.mode === 'fetch' && pagination.recountPage) {
      pagination.recountPage()
    }
    return edges.map((e) => e.node)
  })

  /**
   * Могу ли я подгружать еще записи
   */
  const fetchMoreAvailable = computed<boolean>(() => {
    return pagination.mode === 'fetch' && !q.loading.value && pagination.fetchMore.value
  })
  /**
   * Подгрузка записей
   */
  const fetchMoreData = (): Promise<ApolloQueryResult<TResult>> | undefined => {
    if (!fetchMoreAvailable.value) {
      return
    }
    pagination.setPage(++pagination.page.value)
    return q.fetchMore({
      variables: { ...getValue(variables), ...pagination.extendVariables.value },
      updateQuery: (previousResult: TResult, { fetchMoreResult }): TResult => {
        return Object.keys(previousResult).reduce(
          (a, key) => ({
            ...a,
            [key as keyof TResult]: {
              __typename: previousResult[key].__typename,
              totalCount: (fetchMoreResult as TResult)[key].totalCount,
              pageInfo: (fetchMoreResult as TResult)[key].pageInfo || undefined,
              edges: [...previousResult[key].edges, ...(fetchMoreResult as TResult)[key].edges],
            },
          }),
          {}
        ) as TResult
      },
    })
  }

  /**
   * Событие на подгрузку по прокрутке
   */
  onMounted(() => {
    watch(
      () => data.value,
      () => {
        if (data.value.length === pagination.pageSize.value) {
          if (!isScrollDown) {
            document.documentElement.scrollTop = document.documentElement.scrollHeight
          }
          useEventListener(fetchScroll, 'scroll', async (e: Event) => {
            const eventTarget = (
              e.target === document ? (e.target as Document).documentElement : e.target
            ) as HTMLElement
            if (
              isScrollDown &&
              fetchMoreAvailable.value &&
              eventTarget.scrollTop + window.innerHeight + fetchScrollTrigger > eventTarget.offsetHeight
            ) {
              await fetchMoreData()
            } else if (!isScrollDown && fetchMoreAvailable.value && eventTarget.scrollTop < fetchScrollTrigger) {
              await fetchMoreData()
              if (eventTarget.scrollTop < fetchScrollTrigger && fetchMoreAvailable.value) {
                eventTarget.scrollTop = fetchScrollTrigger + 10
              }
            }
          })
        }
      }
    )
  })

  /**
   * Обновление при совершении мутации
   * @param cache - хранилище
   * @param result - результат выполнения мутации
   * @param transform - функция преобразования
   * @param isStrict - происходит ли исключение, если запись отсутствует в кеше
   */
  const update = <TResultMutation>(
    cache: DataProxy,
    result: Omit<FetchResult<TResultMutation>, 'context'>,
    transform: TransformUpdate<TResult, TResultMutation>,
    isStrict = true
  ): void => {
    try {
      const cacheData = cache.readQuery<TResult, TVariables>({
        query: documentNode as DocumentNode,
        variables: queryVariables.value,
      })
      if (cacheData) {
        const data = transform(cacheData, result)
        cache.writeQuery({ query: documentNode as DocumentNode, variables: queryVariables.value, data })
      }
    } catch (e) {
      if (e instanceof InvariantError && !isStrict) {
        return
      }
      throw e
    }
  }
  /**
   * Получение __typename элементов
   * @param edges - список объектов из списка
   * @param el - манипулируемый объект
   */
  const getEdgeTypename = (edges: { __typename: string }[], el: TNode & { __typename?: string }): string =>
    edges.length === 0 ? `${el.__typename}Edge` : edges[0].__typename
  /**
   * Результат выполнения мутации
   * @param result
   */
  const getMutationResult = <TResultMutation>(
    result: Omit<FetchResult<TResultMutation, Record<string, any>, Record<string, any>>, 'context'>
  ): NonNullable<TResultMutation>[keyof NonNullable<TResultMutation>] | undefined | null =>
    result.data && result.data[Object.keys(result.data)[0] as keyof typeof result.data]

  /**
   * Обновление запроса при добавлении
   * @param cache - хранилище
   * @param result - результат выполнения мутации
   * @param key - элемент в мутации
   */
  const addUpdate = <TResultMutation>(
    cache: DataProxy,
    result: Omit<FetchResult<TResultMutation>, 'context'>,
    key: string | null = null
  ): void => {
    update(cache, result, (dataCache) => {
      const mutationResult = getMutationResult(result)
      if (mutationResult) {
        return Object.keys(dataCache).reduce((a, k) => {
          const kdm: keyof typeof mutationResult = (key === null ? k : key) as keyof typeof mutationResult
          return {
            ...a,
            [k as keyof TResult]: {
              ...dataCache[k],
              totalCount:
                dataCache[k].totalCount +
                (Array.isArray(mutationResult[kdm]) ? (mutationResult[kdm] as TNode[]).length : 1),
              edges: [
                ...(Array.isArray(mutationResult[kdm])
                  ? (mutationResult[kdm] as TNode[]).map((el: TNode) => ({
                      node: el,
                      __typename: getEdgeTypename(dataCache[k].edges, el),
                    }))
                  : [
                      {
                        node: mutationResult[kdm],
                        __typename: getEdgeTypename(
                          dataCache[k].edges,
                          mutationResult[kdm] as TNode & { __typename?: string }
                        ),
                      },
                    ]),
                ...dataCache[k].edges,
              ],
            },
          }
        }, {}) as TResult
      }
      return dataCache
    })
  }

  /**
   * Изменение при редактировании записи
   * @param cache - хранилище
   * @param result - результат выполнения мутации
   * @param key - элемент в мутации
   */
  const changeUpdate = <TResultMutation>(
    cache: DataProxy,
    result: Omit<FetchResult<TResultMutation>, 'context'>,
    key: string | null = null
  ): void => {
    update(cache, result, (dataCache) => {
      const k: string = Object.keys(dataCache)[0]
      const mutationResult = getMutationResult(result)
      if (!mutationResult) return dataCache
      const node: TNode = mutationResult[(key === null ? k : key) as keyof typeof mutationResult] as TNode
      if (node) {
        dataCache[k].edges.find((el: { node: TNode }) => el.node.id === node.id).node = Object.assign(
          dataCache[k].edges.find((el: { node: TNode }) => el.node.id === node.id).node,
          node
        )
      }
      return dataCache
    })
  }

  /**
   * Удаление записи
   * @param cache - хранилище
   * @param result - результат выполнения мутации
   * @param isStrict - происходит ли исключение, если запись отсутствует в кеше
   */
  const deleteUpdate = <TResultMutation>(
    cache: DataProxy,
    result: Omit<FetchResult<TResultMutation>, 'context'>,
    isStrict = true
  ): void => {
    update(
      cache,
      result,
      (dataCache) => {
        const { id } = getMutationResult(result) as unknown as { id: string }
        if (id) {
          const k: string = Object.keys(dataCache)[0]
          dataCache[k].edges = dataCache[k].edges.filter((el: { node: TNode }) => el.node.id !== id)
          --dataCache[k].totalCount
        }
        return dataCache
      },
      isStrict
    )
  }

  return {
    ...q,
    dataQuery,
    data,
    pagination,
    fetchMoreAvailable,
    fetchMoreData,
    update,
    addUpdate,
    changeUpdate,
    deleteUpdate,
  }
}
