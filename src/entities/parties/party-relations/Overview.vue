<template>
    <div class="row">
        <div class="col mb-2">
            <FormSection>
                <template #title>
                    <h3 class="p-2 mb-2"><Icon name="parentParty" /> {{ $t("party.parents") }}</h3>
                </template>
                <OverviewParentParties v-model="item.parentRelationships" :child="item" />
            </FormSection>
        </div>
    </div>
    <div class="row">
        <div class="col mb-2">
            <FormSection>
                <template #title>
                    <h3 class="p-2 mb-2"><Icon name="childParty" /> {{ $t("party.children") }}</h3>
                </template>
                <OverviewChildParties v-model="item.childRelationships" :parent="item" />
            </FormSection>
        </div>
    </div>
</template>

<script setup lang="ts">
import Party from "../data/Entity"
import OverviewParentParties from "./parent-relations/Overview.vue"
import OverviewChildParties from "./child-relations/Overview.vue"

defineEmits<{
    (e: "update:modelValue", args: Party): void
}>()

const item = defineModel<Party>({ required: true })
</script>
