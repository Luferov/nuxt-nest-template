import { parse } from 'cookie-es'
import { useAuthStore } from '~/stores'
import { useNuxtApp } from '#app'
import { MeQuery } from '~/types/graphql'
import meQuery from '~/graphql/auth/queries/me.graphql'

const DEFAULT_CLIENT_ID = 'default'

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const { ssrContext, $apollo, $apolloHelpers } = useNuxtApp()
  const authStore = useAuthStore()
  let token: string | null
  if (process.server) {
    const cookies = parse(ssrContext?.event?.req?.headers?.cookie || '') as Record<string, string>
    token = cookies[`apollo:${DEFAULT_CLIENT_ID}.token`]
  } else {
    token = await $apolloHelpers.getToken()
  }
  if (token && !authStore.loginIn) {
    // If token exists, but user not
    const defaultClient = $apollo.clients[DEFAULT_CLIENT_ID]
    try {
      authStore.user = await defaultClient
        .query({
          query: meQuery,
          fetchPolicy: 'network-only',
        })
        .then(({ data }: { data: MeQuery }) => data.me)
    } catch {
      await $apolloHelpers.onLogout()
    }
  }
})
