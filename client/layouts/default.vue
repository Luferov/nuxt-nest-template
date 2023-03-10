<script setup lang="ts">
import AppBar from '~/components/common/AppBar.vue'
</script>
<template>
  <v-app>
    <app-bar />
    <v-main class="bg-cyan-900">
      <slot />
    </v-main>
  </v-app>
</template>
