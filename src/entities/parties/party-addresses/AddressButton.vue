<template>
    <GMapButton
        :modelValue="[
            modelValue.street,
            modelValue.houseNumber,
            modelValue.postBox,
            modelValue.postalCode,
            modelValue.city,
            modelValue.stateOrProvince,
            modelValue.countryCode,
        ]"
    >
        <Icon name="map" />
    </GMapButton>
</template>

<script setup lang="ts">
import { GMapButton } from "regira_modules/vue/ui"
import type Address from "./Entity"

defineProps<{
    modelValue: Address
}>()
</script>
