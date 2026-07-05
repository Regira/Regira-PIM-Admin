<template>
    <FormSection :title="tm('ContactData')" :readonly="readonly" :show-summary="(party?.id || 0) > 0">
        <List v-model="items" />

        <div class="row">
            <div class="col-md mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="connect" />
                    </div>
                    <input
                        v-model.trim="newContactData"
                        maxlength="256"
                        class="form-control"
                        @blur="handleAddNew"
                        @keydown.enter.prevent="handleAddNew"
                        :placeholder="tm('addNew')"
                        autocomplete="__away"
                        ref="newContactDataInput"
                    />
                    <button type="button" @click.prevent="handleAddNew" class="btn btn-outline-info">
                        <Icon name="new" />
                    </button>
                </div>
            </div>
        </div>
        <template #summary>
            <template v-if="items?.length">
                <div v-for="item in items" class="mb-2" :key="item.id">
                    <div class="input-group">
                        <ActionButton :item="item" class="btn btn-outline-info" />
                        <input v-model="item.value" class="form-control" />
                        <span class="input-group-text" v-if="item.title != null">{{ item.title }}</span>
                    </div>
                </div>
            </template>
            <div v-else class="italic-muted">{{ $t("noItems") }}</div>
        </template>
    </FormSection>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useOwnedCollection } from "regira_modules/vue/entities/form"
import type Party from "../data/Entity"
import { getDataType } from "./functions"
import Entity from "./Entity"
import List from "./List.vue"
import ActionButton from "./ActionButton.vue"
import { useLang, type ITranslationMessage } from "regira_modules/vue/lang"

const emit = defineEmits<{
    (e: "update:modelValue", args: Array<Entity>): void
    (e: "sort", args: any): void
}>()
const props = withDefaults(
    defineProps<{
        modelValue?: Array<Entity>
        party?: Party
        readonly?: boolean
        showSummary?: boolean
    }>(),
    {
        modelValue: () => [],
    }
)

const { items, handleSave } = useOwnedCollection({ props, emit })

const translations: Record<string, ITranslationMessage> = {
    ContactData: {
        en: "Contact data",
        nl: "Contactgegevens",
        fr: "Coordonnées",
    },
    addNew: {
        en: "add new phone, email, website",
        nl: "voeg telefoon, e-mail, website toe",
        fr: "ajouter téléphone, e-mail, site web",
    },
}
const { translateMessage } = useLang()
const tm = computed(() => (key: string) => translateMessage(translations[key]!))

const newContactData = ref<string>()
const newContactDataInput = ref<InstanceType<typeof HTMLInputElement> | null>(null)
function handleAddNew() {
    if (!newContactData.value) {
        return
    }

    const newItem = Object.assign(new Entity(), {
        value: newContactData.value,
        dataType: getDataType({ value: newContactData.value } as Entity),
    })

    handleSave({ saved: newItem, isNew: true })
    newContactData.value = ""
    newContactDataInput.value?.focus()
}
</script>
