<script setup lang="ts">
import { useHead } from '#head'

useHead({
  titleTemplate: '%s | Template for Nuxt/Nest',
})
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
