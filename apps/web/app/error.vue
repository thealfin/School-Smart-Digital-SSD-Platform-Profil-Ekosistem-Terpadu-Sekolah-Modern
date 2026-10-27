<script setup lang="ts">
import type { NuxtError } from '#app'
import Page404 from '~/pages/404.vue'

defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <Page404 :error="error" />
</template>

