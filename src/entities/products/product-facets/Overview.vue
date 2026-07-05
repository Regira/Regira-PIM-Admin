<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <InputSelector v-model="newItem.facet" v-model:idValue="newItem.facetId" />
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-success" @click="handleAdd(newItem)">
                    <Icon name="new" />
                </button>
            </div>
        </div>

        <template v-for="item in items" :key="item.id">
            <div class="row mb-2" :class="{ 'is-deleted': item._deleted }">
                <div class="col">
                    <FormModalButton :modelValue="item.facet" />
                    {{ item.facet?.title ?? "" }}
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-outline-danger" @click="handleRemove(item)">
                        <Icon name="delete" />
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type Product from "../data/Entity"
import ProductFacet from "./Entity"
import InputSelector from "@/entities/facets/selecting/InputSelector.vue"
import FormModalButton from "@/entities/facets/details/FormModalButton.vue"

const props = defineProps<{
    product: Product
}>()

const items = defineModel<ProductFacet[]>({ default: () => [] })
function handleRemove(item: ProductFacet) {
    item._deleted = !item._deleted
}

const newItem = ref<ProductFacet>(ProductFacet.create({ productId: props.product.id }))
function handleAdd(item: ProductFacet) {
    items.value.push(ProductFacet.create({ ...item }))
    newItem.value = ProductFacet.create({ productId: props.product.id })
}
</script>
