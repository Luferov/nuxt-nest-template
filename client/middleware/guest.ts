import { useAuthStore } from '~/stores'
import { useLocalePath } from '#imports'

export default defineNuxtRouteMiddleware((_to, _from) => {
  const authStore = useAuthStore()
  const localePath = useLocalePath()
  if (authStore.loginIn) {
    return navigateTo(localePath({ name: 'index' }))
  }
})
