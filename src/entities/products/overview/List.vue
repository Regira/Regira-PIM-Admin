<template>
    <div class="entity-list">
        <div class="row pb-2 border-bottom border-bottom-1">
            <div class="col-auto">
                <Icon v-if="config.isComplex" name="edit" class="m-1" />
                <FormModalButton v-else disabled class="border-0" />
            </div>
            <div class="col fw-bold">{{ $t("name") }}</div>
            <div class="d-none d-lg-block col-lg col-xl-3 fw-bold">
                {{ $t("product.facets") }}
            </div>
            <div class="d-none d-xl-block col-xl-3 fw-bold">
                {{ $t("product.components") }}
            </div>
            <div class="col-2 d-none d-md-block fw-bold">{{ $t("unitType") }}</div>
            <div class="col-auto fw-bold">
                <Icon name="delete" class="text-muted m-1" />
            </div>
        </div>
        <template v-for="(item, i) in items" :key="item.$id">
            <ListItem
                v-model="items[i]!"
                :readonly="readonly"
                :class="{ 'bg-light': i % 2 == 0 }"
                @request-save="$emit('request-save', $event)"
                @request-remove="$emit('request-remove', $event)"
                @save="$emit('save', $event)"
                @remove="$emit('remove', $event)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OverviewEmits } from "regira_modules/vue/entities"
import config from "../config/config"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"
import ListItem from "./ListItem.vue"
import FormModalButton from "../details/FormModalButton.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
const emit = defineEmits<Emits>()

const props = defineProps<{
    modelValue?: Array<Entity>
    readonly?: boolean
}>()

const { fromPool } = useEntityStore()

const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})
</script>
