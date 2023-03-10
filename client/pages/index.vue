<script setup lang="ts">
import { useHead } from '#head'
import { useI18n } from '#imports'

const { t } = useI18n()

useHead({
  title: t('title'),
})

const count = ref<number>(0)
</script>
<template>
  <div class="text-2xl">
    <v-btn @click="count++">{{ count }}</v-btn>
  </div>
</template>
