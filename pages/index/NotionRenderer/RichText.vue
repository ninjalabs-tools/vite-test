<template>
    <template v-for="part of value">
        <template v-if="part.type == 'text'">
            <span :class="{
                'font-bold': part.annotations.bold,
                'line-through': part.annotations.strikethrough,
                'italic': part.annotations.italic,
                'underline': part.annotations.underline,
            }">{{ part.value.content }}</span>
        </template>
        <template v-else>
            (unsupported rich text type)
        </template>
    </template>
</template>

<script setup lang="ts">
import { VueRichText } from '../../../server/vue-notion';
defineProps<{value: VueRichText}>()
</script>
