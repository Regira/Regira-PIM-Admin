<template>
    <InputSelectorInline v-model="model.facets" :row-key="(r) => r.facetId" :exclude-key="(r) => r.facetId">
        <template #chip="{ row }"> <FormModalButton :modelValue="row.facet" /> {{ row.facet?.title ?? "" }} </template>
        <template #selector="{ add, exclude }">
            <InputSelector :filter-defaults="{ exclude }" @select="(f?: Facet) => f && add(linkTo(f))" />
        </template>
    </InputSelectorInline>
</template>

<script setup lang="ts">
import { InputSelectorInline } from "regira_modules/vue/entities/form"
import type Product from "../data/Entity"
import ProductFacet from "./Entity"
import { type Entity as Facet, InputSelector, FormModalButton } from "@/entities/facets"

const model = defineModel<Product>({ required: true })

function linkTo(f: Facet) {
    return ProductFacet.create({ productId: model.value.id, facetId: f.id, facet: f })
}
</script>
