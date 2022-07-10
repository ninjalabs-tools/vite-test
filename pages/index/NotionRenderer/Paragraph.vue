<template>
    <p>
        <RichText :value="data.rich_text" />
    </p>
</template>

<script setup lang="ts">
import { ParagraphData } from '../../../server/vue-notion';
import RichText from './RichText.vue';

defineProps<{data: ParagraphData}>()
</script>
