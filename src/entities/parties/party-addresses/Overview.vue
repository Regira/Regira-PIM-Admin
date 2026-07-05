<template>
    <FormSection>
        <template #title>
            <div class="d-flex justify-content-between">
                <h3 class="p-2 mb-2">{{ $t("address(es)") }}</h3>
                <FormModalButton
                    v-if="!readonly"
                    :modal-title="$t('addressModalTitle', { name: party.$title })"
                    :item-defaults="defaultValues"
                    class="btn btn-info py-1 my-1"
                    @save="handleSave"
                >
                    <Icon name="new" />
                </FormModalButton>
            </div>
        </template>
        <List v-if="items?.length" v-model="items" :readonly="readonly" />
        <p v-else class="text-info">{{ $t("noItems") }}</p>
    </FormSection>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useOwnedCollection } from "regira_modules/vue/entities"
import type Party from "../data/Entity"
import type Entity from "./Entity"
import List from "./List.vue"
import FormModalButton from "./FormModalButton.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args: Array<Entity>): void
    (e: "sort", args: any): void
}>()
const props = withDefaults(
    defineProps<{
        modelValue?: Array<Entity>
        party: Party
        readonly?: boolean
        showSummary?: boolean
    }>(),
    {
        modelValue: () => [],
    }
)

const { items, handleSave } = useOwnedCollection({ props, emit })

// set default countryCode
const defaultValues = ref({ countryCode: "BE" })
</script>
