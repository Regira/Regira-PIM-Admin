<template>
    <FilterInline v-model="searchObject" @filter="handleFilter" />
</template>

<script setup lang="ts">
import { useFilter, type FilterEmits } from "regira_modules/vue/entities"
import type SearchObject from "./SearchObject"
import FilterInline from "./FilterInline.vue"

interface Emits extends /* @vue-ignore */ FilterEmits<SearchObject> {}
const emit = defineEmits<
    Emits & {
        "update:modelValue": (value: SearchObject) => true
        filter: (value: SearchObject) => true
        "toggle-adv": () => void
        close: () => void
    }
>()

const props = defineProps<{
    modalTitle?: string
    resultCount?: number
}>()

const searchObject = defineModel<SearchObject>({ required: true })

const { handleFilter } = useFilter({ searchObject, emit })
</script>
