<template>
    <button type="button" class="btn btn-default" @click="handleOpen">
        <slot><Icon name="connect" /></slot>
        <Teleport to="#modals">
            <MyModal :is-visible="isOpen" title="Contact data" :showFooter="true" @close="handleCancel" @cancel="handleCancel" @submit="handleSubmit">
                <Form v-model="item" :item-defaults="itemDefaults" class="pt-2" />
            </MyModal>
        </Teleport>
    </button>
</template>

<script setup lang="ts">
import type { Ref } from "vue"
import { useOwnedModal, type SaveResult } from "regira_modules/vue/entities"
import Entity from "./Entity"
import Form from "./Form.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args?: Entity): void
    (e: "save", args: SaveResult<Entity>): void
    (e: "cancel"): void
}>()
const props = defineProps<{
    modelValue?: Entity
    itemDefaults?: Ref<Record<string, any>> | Record<string, any>
}>()

const { item, isOpen, handleOpen, handleCancel, handleSubmit } = useOwnedModal(Entity, { props, emit })
</script>
