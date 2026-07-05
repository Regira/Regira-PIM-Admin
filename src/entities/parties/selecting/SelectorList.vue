<template>
    <div class="entity-list">
        <div class="row pb-2 border-bottom border-bottom-1">
            <div class="col-auto fw-bold">
                <IconButton icon="select" class="btn-default py-0 px-1 border-0" disabled />
            </div>
            <div class="col-2 fw-bold">{{ $t("code") }}</div>
            <div class="col col-md-4 fw-bold">{{ $t("name") }}</div>
            <div class="col d-none d-md-block fw-bold">
                {{ $t("party.partyType") }}
            </div>
        </div>

        <template v-for="(item, i) in items" :key="item.$id">
            <div class="row border-bottom border-bottom-1 py-2" :class="{ 'is-selected': isSelected(item) }">
                <div class="col-auto">
                    <IconButton :icon="isSelected(item) ? 'selected' : 'select'" class="btn-default py-0 px-1" @click="handleSelect(item)" />
                </div>
                <div class="col-2 text-truncate">
                    {{ item.code }}
                </div>
                <div class="col col-md-4 text-truncate">
                    <FormModalButton :modelValue="item" class="p-1" />
                    {{ item.$title }}
                </div>
                <div class="col d-none d-md-block text-truncate">
                    {{ item.partyType }}
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OverviewEmits } from "regira_modules/vue/entities"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"
import FormModalButton from "../details/FormModalButton.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
const emit = defineEmits<
    Emits & {
        (e: "update:modelValue", value: Array<Entity>): void
        (e: "update:selected", value?: Entity): void
        (e: "select", selected?: Entity): void
    }
>()

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
