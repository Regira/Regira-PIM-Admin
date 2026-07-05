<template>
    <div class="entity-list">
        <div class="row pb-2 border-bottom border-bottom-1">
            <div class="col-auto fw-bold">
                <FormModalButton disabled class="border-0" />
            </div>
            <div class="col-4 fw-bold">{{ $t("name") }}</div>
            <div class="col fw-bold">{{ $t("product.components") }}</div>
            <div class="col-auto fw-bold">
                <button type="button" class="btn btn-outline-danger text-muted" disabled>
                    <Icon name="delete" />
                </button>
            </div>
        </div>
        <template v-for="(item, i) in items" :key="item.$id">
            <div class="row border-bottom border-bottom-1 py-2">
                <div class="col-auto">
                    <FormModalButton :modelValue="item" />
                </div>
                <div class="col-4 text-truncate">
                    {{ item.$title }}
                </div>
                <div class="col">
                    <ul class="list-inline mb-0">
                        <li v-for="(component, i) in item.components" :key="component.id" class="list-inline-item">
                            <span :class="{ 'fw-bold': component.componentId == product.id }"
                                >{{ component.component?.title }} ({{ component.quantity }}
                                {{ getUnitType(component.component?.unitType)?.code }})</span
                            ><span v-if="i < item.components!.length - 1">, </span>
                        </li>
                    </ul>
                </div>
                <div class="col-auto">
                    <!-- ToDo: implement -->
                    <button type="button" class="btn btn-outline-danger">
                        <Icon name="delete" />
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OverviewEmits } from "regira_modules/vue/entities"
import { useEntityStore as useUnitTypeStore } from "@/entities/unit-types"
import useEntityStore from "../data/store"
import Entity from "../data/Entity"
import FormModalButton from "../details/FormModalButton.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
const emit = defineEmits<Emits>()

const props = defineProps<{
    product: Entity
    modelValue?: Array<Entity>
    readonly?: boolean
}>()

const { fromPool: getUnitType } = useUnitTypeStore()
const { fromPool } = useEntityStore()

const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})
</script>
