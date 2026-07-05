<template>
    <div class="row border-bottom border-bottom-1 py-2">
        <div class="col-auto">
            <router-link :to="{ name: config.key + 'Details', params: { id: item.$id } }" class="btn btn-link p-1">
                <PartyIcon :item="item" />
            </router-link>
        </div>
        <div class="col col-md-3">
            <div class="d-inline-block text-truncate">
                {{ item.$title }}
            </div>
            <!-- <div class="d-inline-block d-md-none" v-if="item.contactData?.length">
                <template v-for="cd in item.contactData">
                    <ActionButton :item="cd" class="px-2" />
                </template>
</div> -->
            <div class="d-sm-none text-muted" v-if="item.$address != null">
                <small>{{ getLocation(item) }}</small>
                <AddressButton :modelValue="item.$address" class="btn btn-sm btn-default p-0 ps-1" />
            </div>
        </div>
        <div class="col d-none d-sm-block">
            <template v-if="item.$address != null">
                <AddressButton :modelValue="item.$address" class="btn btn-default p-1" />
                {{ getLocation(item) }}
            </template>
        </div>
        <div class="col d-none d-lg-block text-truncate">
            <template v-if="item.contactData?.length">
                <div v-for="cd in getContactData(item)" class="mb-1 text-nowrap">
                    <ActionButton :item="cd" class="p-1" :title="cd.value" />
                    {{ cd.value }}
                </div>
            </template>
        </div>
        <div class="col-auto col-sm-2 d-lg-none">
            <div class="d-inline-block" v-if="item.contactData?.length">
                <template v-for="cd in getContactData(item)">
                    <ActionButton :item="cd" class="px-2" />
                </template>
            </div>
        </div>
        <div class="col-auto">
            <ConfirmButton icon="delete" class="m-0 p-1" :modal-type="ModalType.danger" @confirm="$emit('request-remove', item)">{{
                $t("deleteItem", { title: item?.$title })
            }}</ConfirmButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { distinctBy } from "regira_modules/utilities/array-utility"
import { ModalType, ConfirmButton } from "regira_modules/vue/ui"
import type { SaveResult } from "regira_modules/vue/entities"
import { AddressButton, formatCity } from "../party-addresses"
import { ContactDetails, ActionButton, ContactDataTypes } from "../party-contact-data"
import config from "../config/config"
import Entity from "../data/Entity"
import PartyIcon from "../details/PartyIcon.vue"

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
const getContactData = computed(
    () => (item: Entity) =>
        distinctBy(item.contactData || [], (cd: ContactDetails) => cd.dataType).filter((x) =>
            [ContactDataTypes.email, ContactDataTypes.phone].includes(x.dataType!)
        ) as Array<ContactDetails>
)
const getLocation = computed(() => (item: Entity) => formatCity(item.$address))
</script>
