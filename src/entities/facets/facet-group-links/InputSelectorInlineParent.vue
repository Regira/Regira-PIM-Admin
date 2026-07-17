<template>
    <InputSelectorInline v-model="facet.facetParentGroups" :row-key="(r) => r.facetGroupId" :exclude-key="(r) => r.facetGroupId" @remove="handleRemove">
        <template #chip="{ row }">
            <FormModalButton :modelValue="row.facetGroup" /> {{ row.facetGroup?.title ?? "" }}
        </template>
        <template #selector="{ add, exclude }">
            <InputSelector
                :filter-defaults="{ ...filterDefaults, exclude: [...new Set([...exclude, ...(filterDefaults?.exclude ?? [])])] }"
                @select="(g?: FacetGroup) => g && add(FacetFacetGroup.create({ facetId: facet.id, facetGroupId: g.id, facetGroup: g }))" />
        </template>
    </InputSelectorInline>
</template>

<script setup lang="ts">
import type FacetGroup from "@/entities/facet-groups/data/Entity"
import InputSelector from "@/entities/facet-groups/selecting/InputSelector.vue"
import FormModalButton from "@/entities/facet-groups/details/FormModalButton.vue"
import type Facet from "../data/Entity"
import FacetFacetGroup from "../facet-group-links/FacetFacetGroup"
import { InputSelectorInline } from "regira_modules/vue/entities/form"

const props = defineProps<{ filterDefaults?: Record<string, any> }>()
const facet = defineModel<Facet>({ required: true })

// Preserve the cycle-guard: a soft-deleted link whose target is in the exclude set stays deleted.
function handleRemove(row: FacetFacetGroup) {
    if (props.filterDefaults?.exclude?.includes(row.facetGroupId)) row._deleted = true
}
</script>
