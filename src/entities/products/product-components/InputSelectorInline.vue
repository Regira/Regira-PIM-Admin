<template>
    <InputSelectorInline v-model="items" :row-key="(r) => r.componentId" :exclude-key="(r) => r.componentId">
        <template #chip="{ row }">
            <FormModalButton :modelValue="row.component" /> {{ row.component?.title ?? "" }}
        </template>
        <template #selector="{ add, exclude }">
            <InputSelector :filter-defaults="{ exclude }"
                @select="(p?: Product) => p && add(ProductComponent.create({ assemblyId: product.id, componentId: p.id, component: p }))" />
        </template>
    </InputSelectorInline>
</template>

<script setup lang="ts">
import { InputSelectorInline } from "regira_modules/vue/entities/form"
import type Product from "../data/Entity"
import ProductComponent from "./Entity"
import InputSelector from "../selecting/InputSelector.vue"
import FormModalButton from "../details/FormModalButton.vue"

const { product } = defineProps<{ product: Product }>()
const items = defineModel<ProductComponent[]>({ default: () => [] })
</script>
