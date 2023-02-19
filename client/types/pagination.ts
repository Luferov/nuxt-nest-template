import { ComputedRef, Ref } from 'vue'

export type PageInfo = {
  startCursor?: string
  endCursor?: string
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  __typename?: 'PageInfo'
}
export type PaginationMode = 'fetch' | 'paged'
export type PaginationOptions = { page?: number; pageSize?: number; mode?: PaginationMode }
export type PaginationVariablesType = { first?: number; offset?: number; after?: string }

export interface PaginationInterface {
  mode: PaginationMode
  page: Ref<number>
  setPage: (p: number) => void
  pageSize: Ref<number>
  count: Ref<number>
  totalCount: Ref<number>
  setQueryInfo: (tc: number, c: number, pi?: PageInfo) => void
  fetchMore: ComputedRef<boolean>
  variables: ComputedRef<PaginationVariablesType>
  extendVariables: ComputedRef<PaginationVariablesType>
  recountPage?: () => void
  pageInfo?: Ref<PageInfo>
}
