<template>
    <div class="border-bottom border-bottom-1 py-2">
        <div class="row">
            <div class="col-auto">
                <template v-if="config.isComplex">
                    <!-- Complex entity: Link to input page -->
                    <router-link :to="{ name: config.key + 'Details', params: { id: item.$id } }" class="btn btn-link p-1">
                        <Icon :name="config.key" />
                    </router-link>
                </template>
                <template v-else>
                    <!-- Simple enitty: Open form modal -->
                    <FormModalButton v-model="item" @save="$emit('save', $event)" />
                </template>
            </div>
            <div class="col text-truncate">
                {{ item.$title }}
            </div>
            <div class="d-none d-lg-block col-lg col-xl-3 text-truncate">
                <span v-for="(itemFacet, i) in item.facets" :key="itemFacet.id" class="me-1">
                    {{ getFacet(itemFacet.facet)?.$title }}<span v-if="i < (item.facets ?? []).length - 1">,</span>
                </span>
            </div>
            <div class="d-none d-xl-block col-xl-3 text-truncate">
                <span v-for="(itemComponent, i) in item.components" :key="itemComponent.id" class="me-1">
                    {{ getProduct(itemComponent.component)?.$title }}<span v-if="i < (item.components ?? []).length - 1">,</span>
                </span>
            </div>
            <div class="col-2 d-none d-md-block text-truncate">
                <UnitTypeButton :model-value="item.unitType" />{{ getUnitType(item.unitType)?.$title }}
            </div>
            <div class="col-auto">
                <ConfirmButton icon="delete" class="m-0 p-1" :modal-type="ModalType.danger" @confirm="$emit('request-remove', item)">{{
                    $t("deleteItem", { title: item?.$title })
                }}</ConfirmButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ModalType, ConfirmButton } from "regira_modules/vue/ui"
import { formatCurrency } from "regira_modules/vue/formatters"
import { type SaveResult } from "regira_modules/vue/entities"
import { useEntityStore as useUnitTypeStore, FormModalButton as UnitTypeButton } from "@/entities/unit-types"
import { useEntityStore as useFacetStore, FormModalButton as FacetButton } from "@/entities/facets"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import FormModalButton from "../details/FormModalButton.vue"

const emit = defineEmits<{
    (e: "save", args: SaveResult<Entity>): void
    (e: "remove", item: Entity): void
    (e: "request-save", item: Entity): void
    (e: "request-remove", item: Entity): void
}>()
const props = defineProps<{
    readonly?: boolean
}>()

const item = defineModel<Entity>({ required: true })

const { fromPool: getProduct } = useEntityStore()
const { fromPool: getUnitType } = useUnitTypeStore()
const { fromPool: getFacet } = useFacetStore()
</script>
