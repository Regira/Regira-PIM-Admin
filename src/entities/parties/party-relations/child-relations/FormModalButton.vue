<template>
    <button type="button" class="btn btn-default" @click="handleOpen">
        <slot><Icon name="connect" /></slot>
        <Teleport to="#modals">
            <MyModal
                :is-visible="isOpen"
                :title="modalTitle"
                :full-width="true"
                :showFooter="true"
                :close-on-save="closeOnSave"
                @close="handleCancel"
                @cancel="handleCancel"
                @submit="handleSubmit"
            >
                <Form v-model="item" :itemDefaults="itemDefaults" :parent="parent" class="pt-2" />
            </MyModal>
        </Teleport>
    </button>
</template>

<script setup lang="ts">
import { useOwnedModal, type SaveResult } from "regira_modules/vue/entities"
import type Party from "../../data/Entity"
import Entity from "../Entity"
import Form from "./Form.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args?: Entity): void
    (e: "save", args: SaveResult<Entity>): void
    (e: "cancel"): void
}>()
const props = defineProps<{
    modelValue?: Entity
    itemDefaults?: Partial<Entity>
    parent?: Party
    modalTitle?: string
    closeOnSave?: boolean
}>()

const { item, isOpen, handleOpen, handleCancel, handleSubmit } = useOwnedModal(Entity, { props, emit })
</script>
