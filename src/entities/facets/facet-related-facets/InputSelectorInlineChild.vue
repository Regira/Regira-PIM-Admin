<template>
    <InputSelectorInline v-model="facet.childEntities" :row-key="(r) => r.childId" :exclude-key="(r) => r.childId" @remove="handleRemove">
        <template #chip="{ row }">
            <FormModalButton :modelValue="row.child" /> {{ row.child?.title ?? "" }}
        </template>
        <template #selector="{ add, exclude }">
            <InputSelector
                :filter-defaults="{ ...filterDefaults, exclude: [...new Set([...exclude, ...(filterDefaults?.exclude ?? [])])] }"
                @select="(f?: Facet) => f && add(FacetChild.create({ parentId: facet.id, childId: f.id, child: f }))" />
        </template>
    </InputSelectorInline>
</template>

<script setup lang="ts">
import type Facet from "../data/Entity"
import FacetChild from "./FacetChild"
import InputSelector from "../selecting/InputSelector.vue"
import FormModalButton from "../details/FormModalButton.vue"
import { InputSelectorInline } from "regira_modules/vue/entities/form"

const props = defineProps<{ filterDefaults?: Record<string, any> }>()
const facet = defineModel<Facet>({ required: true })

// Preserve the cycle-guard: a soft-deleted link whose target is in the exclude set
// stays deleted (can't be restored into a parent+child cycle).
function handleRemove(row: FacetChild) {
    if (props.filterDefaults?.exclude?.includes(row.childId)) row._deleted = true
}
</script>
