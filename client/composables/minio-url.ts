import { ComputedRef, Ref } from 'vue'

export function useMinioUrl(url?: Ref<string> | ComputedRef<string> | string | null) {
  const { minioUrl } = useRuntimeConfig()
  return computed(() => (unref(url) ? new URL(unref(url) as string, minioUrl).href : undefined))
}
