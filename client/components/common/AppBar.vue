<script setup lang="ts">
import { useAuthStore } from '~/stores'

const authStore = useAuthStore()
</script>
<template>
  <v-app-bar :title="$t('title')" floating>
    <template #prepend>
      <v-img src="/favicon.ico" />
    </template>
    <template #append>
      <template v-if="authStore.loginIn">
        <v-menu>
          <template #activator="{ props }">
            <v-avatar v-bind="props" color="primary"></v-avatar>
          </template>
          <v-list>
            <v-list-item :to="localePath({ name: 'auth-logout' })">
              <v-list-item-title>{{ $t('auth.logout') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-btn :to="localePath({ name: 'auth-login' })" stacked>{{ $t('auth.login') }}</v-btn>
      </template>
    </template>
  </v-app-bar>
</template>
