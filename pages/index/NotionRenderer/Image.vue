<template>
    <img :src="data.url.original">
</template>

<script setup lang="ts">
import { ImageData } from '../../../server/vue-notion';

defineProps<{data: ImageData}>()
</script>
