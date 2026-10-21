<template>
    <div class="input-selector input-group text-nowrap">
        <slot name="prepend">
            <FormModalButton
                v-if="canEdit"
                v-model="item"
                :item-defaults="itemDefaults"
                :readonly="readonly"
                :close-on-save="closeOnSave"
                class="btn btn-outline-secondary"
                @save="({ saved }) => handleSelect(saved)"
            >
                <Icon :name="config.key" v-if="item?.id" />
                <Icon v-else name="new" />
            </FormModalButton>
        </slot>
        <slot>
            <Autocomplete
                class="form-control"
                v-model="item"
                :filter-defaults="filterDefaults"
                :readonly="readonly"
                :placeholder="placeholder"
                @select="handleSelect"
                ref="autoEl"
            />
        </slot>
        <slot name="append">
            <template v-if="!readonly">
                <button v-if="!readonly" type="button" v-show="item != null" class="btn btn-outline-secondary" @click="handleSelect(undefined)">
                    <Icon name="clear" />
                </button>
                <SelectorModalButton
                    v-model="item"
                    :filter-defaults="filterDefaults"
                    :disabled="readonly"
                    @select="handleSelect"
                    class="btn btn-outline-info"
                />
            </template>
        </slot>
    </div>
</template>

<script setup lang="ts">
import { computed, watch, type Ref } from "vue"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import FormModalButton from "../details/FormModalButton.vue"
import Autocomplete from "./Autocomplete.vue"
import SelectorModalButton from "./SelectorModalButton.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args?: Entity): void
    (e: "update:idValue", args?: number | string): void
    (e: "select", args?: Entity): void
}>()
const props = withDefaults(
    defineProps<{
        modelValue?: Entity
        idValue?: number | string
        readonly?: boolean
        canEdit?: boolean
        itemDefaults?: Ref<Record<string, any>> | Record<string, any>
        filterDefaults?: Record<string, any>
        closeOnSave?: boolean
        placeholder?: string
    }>(),
    {
        canEdit: true,
    }
)

const { fromPool, list } = useEntityStore()
const item = computed<Entity | undefined>({
    get: () => fromPool(props.modelValue) as Entity,
    set: (value) => {
        emit("update:modelValue", value)
        emit("update:idValue", value?.id)
    },
})

function handleSelect(selected?: Entity) {
    if (item.value?.id != selected?.id) {
        item.value = selected // emit
        emit("select", selected)
    }
}

// Two v-models: `idValue` is the FK that gets saved (or filtered on), `modelValue` is the entity that gets displayed.
// Keep the entity in step with the FK whenever it changes — at setup, and again when the parent assigns or clears it
// later (a filter reset, a restored query string), which would otherwise leave a stale row on screen.
watch(
    () => props.idValue,
    async (id, previous) => {
        if (!id) {
            // cleared by the parent — only a real change: bound without `idValue`, it never moves
            if (previous && props.modelValue) emit("update:modelValue", undefined)
            return
        }
        if (props.modelValue?.id == id) return
        let model
        try {
            model = await list({ id })
        } catch {
            return // a caller who may not read this entity (403) keeps the FK and shows no row
        }
        if (props.idValue == id) emit("update:modelValue", model[0]) // a newer FK arrived meanwhile: drop this answer
    },
    { immediate: true }
)
</script>
