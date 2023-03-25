<script setup lang="ts">
import AppBar from '~/components/common/AppBar.vue'
</script>
<template>
  <v-app>
    <app-bar />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
