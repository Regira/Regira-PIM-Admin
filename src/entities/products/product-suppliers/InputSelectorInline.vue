<template>
    <InputSelectorInline v-model="model.suppliers" :row-key="(r) => r.supplierId" :exclude-key="(r) => r.supplierId">
        <template #chip="{ row }">
            <FormModalButton :modelValue="row.supplier!" /> {{ getSupplier(row.supplier!)?.$title ?? "" }}
        </template>
        <template #selector="{ add, exclude }">
            <InputSelector :filter-defaults="{ exclude }"
                @select="(p?: Party) => p && add(ProductSupplier.create({ productId: model.id, supplierId: p.id, supplier: p }))" />
        </template>
    </InputSelectorInline>
</template>

<script setup lang="ts">
import { type Entity as Party, FormModalButton, InputSelector, useEntityStore } from "@/entities/parties"
import { InputSelectorInline } from "regira_modules/vue/entities/form"
import type Product from "../data/Entity"
import ProductSupplier from "./Entity"

const model = defineModel<Product>({ required: true })

const { fromPool } = useEntityStore()
const getSupplier = (x: Party) => fromPool(x)
</script>
