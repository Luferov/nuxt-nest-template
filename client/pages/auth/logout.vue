<script setup lang="ts">
import { useAuthStore } from '~/stores'
import { definePageMeta, useApollo, useLocalePath } from '#imports'

import { useRouter } from '#app'

definePageMeta({
  middleware: 'auth',
})
const { onLogout } = useApollo()
const authStore = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()

await onLogout()
authStore.user = null
router.push(localePath({ name: 'index' }))
</script>

<template>
  <v-container>
    <v-progress-circular color="primary" indeterminate />
  </v-container>
</template>
