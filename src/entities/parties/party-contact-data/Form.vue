<template>
    <div>
        <div class="row">
            <div class="col-md mb-2">
                <div class="input-group">
                    <ActionButton :item="item" class="btn btn-outline-secondary" />
                    <input
                        v-focus
                        v-model.trim="item.value"
                        maxlength="256"
                        class="form-control"
                        :required="item.id != 0"
                        :placeholder="tm('valuePlaceholder')"
                        @change="handleChangeValue"
                    />
                </div>
                <FormLabel :label="item.dataType || tm('ContactType')" />
            </div>
        </div>
        <div class="row">
            <div class="col-md mb-2">
                <input v-model.trim="item.title" :placeholder="tm('titlePlaceholder')" maxlength="32" class="form-control" />
                <FormLabel :label="tm('Title')" />
            </div>
        </div>

        <!-- Description -->
        <div class="row">
            <div class="col-md mb-2">
                <DescriptionInput v-model="item.description" :label="$t('description')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type Entity from "./Entity"
import ActionButton from "./ActionButton.vue"
import { getDataType } from "./functions"
import { useLang, type ITranslationMessage } from "regira_modules/vue/lang"

const props = defineProps<{
    readonly?: boolean
}>()

function handleChangeValue() {
    item.value.dataType = getDataType(item.value)
}
const item = defineModel<Entity>({ required: true })

const translations: Record<string, ITranslationMessage> = {
    valuePlaceholder: {
        en: "phone | email | website",
        nl: "telefoon | e-mail | website",
        fr: "téléphone | e-mail | site web",
    },
    ContactType: {
        en: "Phone, Email, Website",
        nl: "Telefoon, E-mail, Website",
        fr: "Téléphone, E-mail, Site web",
    },
    titlePlaceholder: {
        en: "home, work, private, ...",
        nl: "thuis, werk, privé, ...",
        fr: "maison, travail, privé, ...",
    },
    Title: {
        en: "Title",
        nl: "Titel",
        fr: "Titre",
    },
}
const { translateMessage } = useLang()
const tm = computed(() => (key: string) => translateMessage(translations[key]!))
</script>
