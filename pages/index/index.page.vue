<template>
    <template v-for="block of content">
        <Heading1 v-if="block.component == 'Heading1'" :data="block.data" />
        <Paragraph v-if="block.component == 'Paragraph'" :data="block.data" />
        <Image v-if="block.component == 'Image'" :data="block.data" />
    </template>
</template>

<script lang="ts" setup>
import { VueBlocks } from "../../server/vue-notion";
import Heading1 from "./NotionRenderer/Heading1.vue";
import Paragraph from './NotionRenderer/Paragraph.vue';
import Image from "./NotionRenderer/Image.vue";
defineProps<{ content: VueBlocks }>()
</script>
