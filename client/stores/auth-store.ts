import { defineStore } from 'pinia'
import { User } from '~/types/graphql'

export type AuthStoreStateType = {
  user: User | null
}

export type AuthStoreGettersType = {
  loginIn: (state: AuthStoreStateType) => boolean
}

export const useAuthStore = defineStore<string, AuthStoreStateType, AuthStoreGettersType>('authStore', {
  state: () => ({
    user: null,
  }),
  getters: {
    loginIn: (state) => state.user !== null,
  },
})
