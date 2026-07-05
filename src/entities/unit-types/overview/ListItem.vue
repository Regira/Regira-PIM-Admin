<template>
    <div class="row border-bottom border-bottom-1 py-2">
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
        <div class="col-2 col-lg-1 text-truncate">
            {{ item.code }}
        </div>
        <div class="col text-truncate">
            {{ item.$title }}
        </div>
        <div class="col-auto">
            <ConfirmButton icon="delete" class="m-0 p-1" :modal-type="ModalType.danger" @confirm="$emit('request-remove', item)">{{
                $t("deleteItem", { title: item?.$title })
            }}</ConfirmButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ModalType, ConfirmButton } from "regira_modules/vue/ui"
import type { SaveResult } from "regira_modules/vue/entities"
import config from "../config/config"
import Entity from "../data/Entity"
import FormModalButton from "../details/FormModalButton.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args: Entity): void
    (e: "save", args: SaveResult<Entity>): void
    (e: "remove", args: Entity): void
    (e: "request-save", args: Entity): void
    (e: "request-remove", args: Entity): void
}>()
const props = defineProps<{
    readonly?: boolean
}>()

const item = defineModel<Entity>({ required: true })
</script>
