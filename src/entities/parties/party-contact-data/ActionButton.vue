<template>
    <MyAnchor v-if="href" :href="href" :target="dataType == ContactDataTypes.website ? '_blank' : undefined">
        <ContactDataIcon :type="dataType" />
    </MyAnchor>
    <button v-else type="button" class="btn btn-default border-1" @click="copyTextToClipboard(item!.value)">
        <ContactDataIcon :type="dataType" />
    </button>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { clipboardUtility as copyTextToClipboard } from "regira_modules/utilities"
import { getDataType } from "./functions"
import type Entity from "./Entity"
import ContactDataTypes from "./ContactDataTypes"
import ContactDataIcon from "./ContactDataIcon.vue"

const props = defineProps<{
    item?: Entity
}>()

const dataType = computed(() => getDataType(props.item))
const href = computed(() => {
    switch (dataType.value) {
        case ContactDataTypes.phone:
            return `tel:${props.item!.value}`
        case ContactDataTypes.email:
            return `mailto:${props.item!.value}`
        case ContactDataTypes.website:
            return props.item!.value
        default:
            return undefined
    }
})
</script>
