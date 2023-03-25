import { defineStore } from 'pinia'
import { User } from '~/types/graphql'
import { useMinioUrl } from '~/composables/minio-url'

export type AuthStoreStateType = {
  user: User | null
}

export type AuthStoreGettersType = {
  loginIn: (state: AuthStoreStateType) => boolean
  initials: (state: AuthStoreStateType) => string
  avatarUrl: (state: AuthStoreStateType) => string | undefined
}

export const useAuthStore = defineStore<string, AuthStoreStateType, AuthStoreGettersType>('authStore', {
  state: () => ({
    user: null,
  }),
  getters: {
    loginIn: (state) => state.user !== null,
    initials: (state) => (state.user ? `${state.user.lastName[0]}${state.user.firstName[0]}` : ''),
    avatarUrl: (state) => {
      return useMinioUrl(computed(() => state.user?.avatar as string)).value
    },
  },
})
