<template>
    <InputSelectorInline v-model="facetGroup.childFacets" :row-key="(r) => r.facetId" :exclude-key="(r) => r.facetId" @remove="handleRemove">
        <template #chip="{ row }"> <FormModalButton :modelValue="row.facet" /> {{ row.facet?.title ?? "" }} </template>
        <template #selector="{ add, exclude }">
            <InputSelector
                :filter-defaults="{ ...filterDefaults, exclude: [...new Set([...exclude, ...(filterDefaults?.exclude ?? [])])] }"
                @select="(f?: Facet) => f && add(linkTo(f))"
            />
        </template>
    </InputSelectorInline>
</template>

<script setup lang="ts">
import type Facet from "@/entities/facets/data/Entity"
import InputSelector from "@/entities/facets/selecting/InputSelector.vue"
import FormModalButton from "@/entities/facets/details/FormModalButton.vue"
import type FacetGroup from "../data/Entity"
import FacetGroupFacet from "./Entity"
import { InputSelectorInline } from "regira_modules/vue/entities/form"

const props = defineProps<{ filterDefaults?: Record<string, any> }>()
const facetGroup = defineModel<FacetGroup>({ required: true })

function linkTo(f: Facet) {
    return FacetGroupFacet.create({ facetGroupId: facetGroup.value.id, facetId: f.id, facet: f })
}

// Preserve the cycle-guard: a soft-deleted link whose target is in the exclude set stays deleted.
function handleRemove(row: FacetGroupFacet) {
    if (props.filterDefaults?.exclude?.includes(row.facetId)) row._deleted = true
}
</script>
