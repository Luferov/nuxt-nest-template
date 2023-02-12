import { defineStore } from 'pinia'
import { User } from '~/types/graphql'

export type AuthStoreStateType = {
	user: User | null
}

export type AuthStoreGettersType = {
	loginIn: (state: any) => boolean
}

export type AuthStoreActionsType = {}

export const useAuthStore = defineStore<string, AuthStoreStateType, AuthStoreGettersType, AuthStoreActionsType>(
	'authStore',
	{
		state: () => ({
			user: null,
		}),
		getters: {
			loginIn: state => state.user !== null,
		},
	}
)
