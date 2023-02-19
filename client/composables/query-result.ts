import type { Ref } from 'vue'
import { computed } from 'vue'
import type { ExtractSingleKey } from '@vue/apollo-composable/dist/util/ExtractSingleKey'
import type { DeepNonNullable, DeepRequired } from 'ts-essentials'

export type UseResultReturn<T> = Readonly<Ref<Readonly<T>>>

/**
 * Resolve a `result`, returning either the first key of the `result` if there
 * is only one, or the `result` itself. The `value` of the ref will be
 * `undefined` until it is resolved.
 *
 * @example
 * const { result } = useQuery(...)
 * const user = useResult(result)
 * // user is `undefined` until the query resolves
 *
 * @param  {Ref<TResult>} result A `result` returned from `useQuery` to resolve.
 * @returns Readonly ref with `undefined` or the resolved `result`.
 */
export function useResult<TResult, TResultKey extends keyof NonNullable<TResult> = keyof NonNullable<TResult>>(
  result: Ref<TResult | undefined>
): UseResultReturn<undefined | ExtractSingleKey<NonNullable<TResult>, TResultKey>>

/**
 * Resolve a `result`, returning either the first key of the `result` if there
 * is only one, or the `result` itself. The `value` of the ref will be
 * `defaultValue` until it is resolved.
 *
 * @example
 * const { result } = useQuery(...)
 * const profile = useResult(result, {})
 * // profile is `{}` until the query resolves
 *
 * @param  {Ref<TResult>} result A `result` returned from `useQuery` to resolve.
 * @param  {TDefaultValue} defaultValue The default return value before `result` is resolved.
 * @returns Readonly ref with the `defaultValue` or the resolved `result`.
 */
export function useResult<
  TResult,
  TDefaultValue,
  TResultKey extends keyof NonNullable<TResult> = keyof NonNullable<TResult>
>(
  result: Ref<TResult | undefined>,
  defaultValue: TDefaultValue
): UseResultReturn<TDefaultValue | ExtractSingleKey<NonNullable<TResult>, TResultKey>>

/**
 * Resolve a `result`, returning the `result` mapped with the `pick` function.
 * The `value` of the ref will be `defaultValue` until it is resolved.
 *
 * @example
 * const { result } = useQuery(...)
 * const comments = useResult(result, undefined, (data) => data.comments)
 * // user is `undefined`, then resolves to the result's `comments`
 *
 * @param  {Ref<TResult>} result A `result` returned from `useQuery` to resolve.
 * @param  {TDefaultValue} defaultValue The default return value before `result` is resolved.
 * @param  {(data:TResult)=>TReturnValue} pick The function that receives `result` and maps a return value from it.
 * @returns Readonly ref with the `defaultValue` or the resolved and `pick`-mapped `result`
 */
export function useResult<TResult, TDefaultValue, TReturnValue>(
  result: Ref<TResult | undefined>,
  defaultValue: TDefaultValue | undefined,
  pick: (data: DeepRequired<DeepNonNullable<TResult>>) => TReturnValue
): UseResultReturn<TDefaultValue | TReturnValue>

export function useResult<TResult, TDefaultValue, TReturnValue>(
  result: Ref<TResult | undefined>,
  defaultValue?: TDefaultValue,
  pick?: (data: DeepRequired<DeepNonNullable<TResult>>) => TReturnValue
): UseResultReturn<TResult | TResult[keyof TResult] | TDefaultValue | TReturnValue | undefined> {
  return computed(() => {
    const value = result.value
    if (value) {
      if (pick) {
        try {
          return pick(value as DeepRequired<DeepNonNullable<TResult>>)
        } catch (e) {}
      } else {
        const keys = Object.keys(value)
        if (keys.length === 1) {
          return value[keys[0] as keyof TResult]
        } else {
          return value
        }
      }
    }
    return defaultValue
  })
}
