import defu from 'defu'
import type { ComputedRef } from 'vue'
import { computed, ref } from 'vue'

import type { PageInfo, PaginationInterface, PaginationOptions, PaginationVariablesType } from '~/types/pagination'
import { cursor } from '~/services/graphql-relay'

/**
 * Пагинация, основанная на offset подходе
 * @param paginationOptions
 */
export function useOffsetPagination(paginationOptions: PaginationOptions = {}): PaginationInterface {
  const defaultOptions: PaginationOptions = {
    page: 1,
    pageSize: 30,
    mode: 'fetch',
  }
  const options: PaginationOptions = defu(paginationOptions, defaultOptions)

  const page = ref<number>(options.page!)
  const pageSize = ref<number>(options.pageSize!)
  const count = ref<number>(0)
  const totalCount = ref<number>(0)

  const extendVariables = computed<PaginationVariablesType>(() => ({
    first: pageSize.value,
    offset: (page.value - 1) * pageSize.value,
  }))

  /**
   * Расширение переменных в зависимости от типа пагинации
   */
  const variables: ComputedRef<PaginationVariablesType> =
    options.mode === 'fetch'
      ? computed<PaginationVariablesType>(() => ({
          first: pageSize.value,
          offset: 0,
        }))
      : extendVariables

  const fetchMore: ComputedRef<boolean> = computed<boolean>(() => {
    return page.value * pageSize.value < totalCount.value
  })

  /**
   * Пересчитываем значение позиции страницы
   */
  const recountPage = (): void => {
    page.value = Math.ceil(count.value / pageSize.value)
  }

  /**
   * Устанавливаем новую страницу
   * @param p
   */
  const setPage = (p = 1): void => {
    page.value = p
  }

  /**
   * Устанавливаем количество записей
   * @param tc - totalCount
   * @param c - count
   */
  const setQueryInfo = (tc: number, c: number): void => {
    count.value = c
    totalCount.value = tc
  }

  return {
    mode: options.mode!,
    page,
    pageSize,
    totalCount,
    count,
    fetchMore,
    variables,
    extendVariables,
    setPage,
    setQueryInfo,
    recountPage,
  }
}

/**
 * Пагинация, основанная на cursor подходе
 * @param paginationOptions
 */
export function useCursorPagination(paginationOptions: PaginationOptions = {}): PaginationInterface {
  const {
    page,
    setPage,
    pageSize,
    mode,
    totalCount,
    count,
    setQueryInfo: setQueryInfoParent,
  } = useOffsetPagination(paginationOptions)

  const pageInfo = ref<PageInfo>({
    hasPreviousPage: true,
    hasNextPage: true,
  })

  const variables: ComputedRef<PaginationVariablesType> = computed<PaginationVariablesType>(() => ({
    first: pageSize.value,
  }))

  const extendVariables: ComputedRef<PaginationVariablesType> = computed<PaginationVariablesType>(() => ({
    first: pageSize.value,
    after: cursor(count.value - 1),
  }))

  const fetchMore: ComputedRef<boolean> = computed<boolean>(() => {
    return pageInfo.value.hasNextPage!
  })

  /**
   * Устанавливаем количество записей
   * @param tc - totalCount
   * @param c - количество записей
   * @param pi - pageInfo
   */
  const setQueryInfo = (tc: number, c: number, pi?: PageInfo): void => {
    setQueryInfoParent(tc, c)
    if (pi) {
      pageInfo.value = pi
    }
  }

  return {
    mode,
    page,
    pageSize,
    totalCount,
    count,
    fetchMore,
    variables,
    extendVariables,
    pageInfo,
    setPage,
    setQueryInfo,
  }
}
