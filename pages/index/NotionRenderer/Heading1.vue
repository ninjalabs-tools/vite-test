<template>
    <h1>
        <RichText :value="data.rich_text" />
    </h1>
</template>

<script setup lang="ts">
import { Heading1Data } from '../../../server/vue-notion';
import RichText from './RichText.vue';

defineProps<{data: Heading1Data}>()
</script>
