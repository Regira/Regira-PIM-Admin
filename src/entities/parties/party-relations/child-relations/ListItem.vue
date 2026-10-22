<template>
    <div class="card h-100">
        <div class="row g-0 bg-info bg-opacity-75">
            <div class="col-auto">
                <div class="drag-handle bg-info cursor move border-0 pt-2"><Icon name="move" /></div>
            </div>
            <div class="col p-2">
                <span class="fst-italic">{{ item.relationshipType?.title }}</span>
            </div>
            <div class="col-auto">
                <FormModalButton v-model="item" :parent="parent" :modalTitle="$t('party.parent', { name: parent?.$title })" class="btn btn-default"
                    ><Icon name="edit"
                /></FormModalButton>
                <button type="button" class="btn btn-default m-1" @click="item._deleted = !item._deleted">
                    <Icon name="delete" />
                </button>
            </div>
        </div>
        <div class="row g-0">
            <div class="col-auto bg-light">
                <PartyButton v-model="item.child" class="btn btn-default" />
            </div>
            <div class="col p-2">
                {{ item.child?.title }}
            </div>
        </div>
        <div class="row g-0" v-for="contactData in item.contactData?.filter((x) => !x._deleted)" :key="contactData.id">
            <div class="col-auto bg-light">
                <ActionButton class="btn btn-link cursor pointer" :item="contactData" />
            </div>
            <div class="col p-2">
                {{ contactData.value }}
            </div>
        </div>
        <div class="row g-0 opacity-50" v-for="contactData in item.child?.contactData" :key="contactData.id">
            <div class="col-auto bg-light">
                <ActionButton class="btn btn-link cursor pointer" :item="contactData" />
            </div>
            <div class="col p-2">
                {{ contactData.value }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ActionButton } from "../../party-contact-data"
import type Party from "../../data/Entity"
import type Entity from "../Entity"
import PartyButton from "../../details/FormModalButton.vue"
import FormModalButton from "./FormModalButton.vue"

defineProps<{
    parent: Party
}>()

const item = defineModel<Entity>({ required: true })
</script>
