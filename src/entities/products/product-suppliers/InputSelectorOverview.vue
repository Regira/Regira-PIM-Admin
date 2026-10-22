<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <InputSelector @select="handleAdd" :filterDefaults="{ exclude: excludeIds }" />
            </div>
        </div>

        <template v-for="(item, i) in items" :key="item.id">
            <div class="row mb-2" :class="{ 'is-deleted': item._deleted }">
                <div class="col">
                    <InputSelector v-model="items[i]!.supplier" />
                </div>
                <div class="col-4 text-truncate">
                    <span class="form-control">{{ getLocation(item.supplier!) }}</span>
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
import { computed } from "vue"
import { type Entity as Party, InputSelector, useEntityStore, formatCity } from "@/entities/parties"
import type Product from "../data/Entity"
import ProductSupplier from "./Entity"

const model = defineModel<Product>({ required: true })
const items = computed(() => model.value.suppliers ?? [])
const excludeIds = computed(() => items.value.map((i) => i.supplierId))

function handleRemove(item: ProductSupplier) {
    item._deleted = !item._deleted
}

function handleAdd(item?: Party) {
    if (!model.value.suppliers) model.value.suppliers = []
    model.value.suppliers.push(
        ProductSupplier.create({
            productId: model.value.id,
            supplierId: item?.id,
            supplier: item,
        })
    )
}

const { fromPool } = useEntityStore()
const getSupplier = (x: Party) => fromPool(x)
const getLocation = computed(() => (item: Party) => formatCity(getSupplier(item).$address))
</script>
