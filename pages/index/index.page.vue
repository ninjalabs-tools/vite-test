<template>
  <h1>Welcome</h1>
  Die aktuellen keks:
  <ul>
    <li v-for="kek of keks">{{ kek.title }}</li>
  </ul>
  <br />
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>
</template>

<script lang="ts" setup>
import Counter from './Counter.vue'
defineProps<{ keks: {title: string}[] }>()
</script>
