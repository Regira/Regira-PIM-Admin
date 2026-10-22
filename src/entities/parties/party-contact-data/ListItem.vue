<template>
    <div class="row">
        <div class="col-md mb-2">
            <div class="input-group">
                <span class="input-group-text drag-handle cursor move">
                    <Icon name="move" />
                </span>
                <ActionButton :item="item" class="btn btn-outline-info" />
                <input v-model="item.value" class="form-control" @change="handleChangeValue" />
                <span class="input-group-text" v-if="item.title != null">{{ item.title }}</span>
                <FormModalButton class="btn btn-outline-secondary" v-model="item">
                    <Icon name="edit" />
                </FormModalButton>
                <button v-if="item.id != 0" type="button" class="btn btn-outline-danger" @click="item._deleted = !item._deleted">
                    <Icon name="delete" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type Entity from "./Entity"
import { getDataType } from "./functions"
import FormModalButton from "./FormModalButton.vue"
import ActionButton from "./ActionButton.vue"

defineProps<{
    readonly?: boolean
}>()

function handleChangeValue() {
    item.value.dataType = getDataType(item.value)
}

const item = defineModel<Entity>({ required: true })
</script>
