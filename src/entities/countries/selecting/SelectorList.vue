<template>
    <div class="entity-list">
        <div class="row pb-2 border-bottom border-bottom-1">
            <div class="col-auto fw-bold">
                <Icon name="edit" class="m-1" />
            </div>
            <div class="col-1 fw-bold">Code</div>
            <div class="col fw-bold">Title</div>
        </div>

        <template v-for="item in items" :key="item.$id">
            <div class="row border-bottom border-bottom-1 py-2" :class="{ 'is-selected': isSelected(item) }">
                <div class="col-auto">
                    <IconButton :icon="isSelected(item) ? 'selected' : 'select'" class="btn-default py-0 px-1" @click="handleSelect(item)" />
                </div>
                <div class="col-1">
                    {{ item.code }}
                </div>
                <div class="col">
                    {{ item.$title }}
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { IPagingInfo } from "regira_modules/vue/entities"
import { computed } from "vue"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"
import type SearchObject from "../filter/SearchObject"

interface Emits {
    (e: "select", selected?: Entity): void
    (e: "update:modelValue", args: Array<Entity>): void
    (e: "update:searchObject", args: SearchObject): void
    (e: "update:pagingInfo", args: IPagingInfo): void
}
const emit = defineEmits<Emits>()
const props = defineProps<{
    modelValue?: Array<Entity>
    selected?: Entity
}>()

const isSelected = computed(() => (item: Entity) => item.$id == props.selected?.$id)
const { fromPool } = useEntityStore()
const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})

function handleSelect(item?: Entity) {
    emit("select", item?.$id !== props.selected?.$id ? item : undefined)
}
</script>
