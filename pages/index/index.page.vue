<template>
  <h1>Welcome</h1>
  Time: {{ time }}
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>
</template>

<script lang="ts" setup>
import Counter from './Counter.vue'
defineProps<{ time: string }>()
</script>
