<template>
    <InputSelectorInline v-model="facet.parentEntities" :row-key="(r) => r.parentId" :exclude-key="(r) => r.parentId" @remove="handleRemove">
        <template #chip="{ row }">
            <FormModalButton :modelValue="row.parent" /> {{ row.parent?.title ?? "" }}
        </template>
        <template #selector="{ add, exclude }">
            <InputSelector
                :filter-defaults="{ ...filterDefaults, exclude: [...new Set([...exclude, ...(filterDefaults?.exclude ?? [])])] }"
                @select="(f?: Facet) => f && add(FacetParent.create({ childId: facet.id, parentId: f.id, parent: f }))" />
        </template>
    </InputSelectorInline>
</template>

<script setup lang="ts">
import type Facet from "../data/Entity"
import FacetParent from "./FacetParent"
import InputSelector from "../selecting/InputSelector.vue"
import FormModalButton from "../details/FormModalButton.vue"
import { InputSelectorInline } from "regira_modules/vue/entities/form"

const props = defineProps<{ filterDefaults?: Record<string, any> }>()
const facet = defineModel<Facet>({ required: true })

// Preserve the cycle-guard: a soft-deleted link whose target is in the exclude set
// stays deleted (can't be restored into a parent+child cycle).
function handleRemove(row: FacetParent) {
    if (props.filterDefaults?.exclude?.includes(row.parentId)) row._deleted = true
}
</script>
