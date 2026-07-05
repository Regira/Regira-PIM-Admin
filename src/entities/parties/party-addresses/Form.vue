<template>
    <div style="min-height: 40vh">
        <div class="row">
            <div class="col-md mb-2">
                <CountrySelector
                    v-model="country"
                    v-model:idValue="item.countryCode"
                    :readonly="readonly"
                    :placeholder="tm('country')"
                    :auto-select="true"
                />
                <FormLabel :label="tm('Country')" />
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 mb-2">
                <input
                    v-model.trim="item.postalCode"
                    maxlength="256"
                    :readonly="readonly"
                    class="form-control"
                    :placeholder="tm('zip')"
                    autocomplete="__away"
                />
                <FormLabel :label="tm('Zip')" />
            </div>
            <div class="col mb-2">
                <input
                    v-model.trim="item.city"
                    maxlength="256"
                    :readonly="readonly"
                    class="form-control"
                    :placeholder="tm('city')"
                    autocomplete="__away"
                />
                <FormLabel :label="tm('City')" />
            </div>
        </div>
        <div class="row">
            <div class="col-md mb-2">
                <div class="input-group">
                    <input
                        v-model.trim="item.street"
                        maxlength="256"
                        :readonly="readonly"
                        class="form-control"
                        :placeholder="tm('street')"
                        autocomplete="__away"
                    />
                </div>
                <FormLabel :label="tm('Street')" />
            </div>
            <div class="col-md-2 mb-2">
                <input
                    v-model.trim="item.houseNumber"
                    maxlength="256"
                    :readonly="readonly"
                    class="form-control"
                    :placeholder="tm('nr')"
                    autocomplete="__away"
                />
                <FormLabel :label="tm('Number')" />
            </div>
            <div class="col-md-2 mb-2">
                <input
                    v-model.trim="item.unitNumber"
                    maxlength="256"
                    :readonly="readonly"
                    class="form-control"
                    :placeholder="tm('box')"
                    autocomplete="__away"
                />
                <FormLabel :label="tm('BoxNr')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useVModelField } from "regira_modules/vue/vue-helper"
import { useLang, type ITranslationMessage } from "regira_modules/vue/lang"
import { type Entity as Country, InputSelector as CountrySelector } from "../../countries"
import type Entity from "./Entity"

const emit = defineEmits<{
    (e: "update:modelValue", item: Entity): void
}>()
const props = defineProps<{
    modelValue: Entity
    readonly?: boolean
}>()

const item = useVModelField<Entity>(props, emit)
const country = ref<Country>()

const translations: Record<string, ITranslationMessage> = {
    box: {
        en: "box",
        nl: "bus",
        fr: "boîte",
    },
    BoxNr: {
        en: "Box nr",
        nl: "Busnr",
        fr: "Boîte n°",
    },
    city: {
        en: "city",
        nl: "gemeente",
        fr: "ville",
    },
    City: {
        en: "City",
        nl: "Gemeente",
        fr: "Ville",
    },
    country: {
        en: "country",
        nl: "land",
        fr: "pays",
    },
    Country: {
        en: "Country",
        nl: "Land",
        fr: "Pays",
    },
    nr: {
        en: "nr",
        nl: "nr",
        fr: "n°",
    },
    Number: {
        en: "Number",
        nl: "Nr",
        fr: "Numéro",
    },
    street: {
        en: "street",
        nl: "straat",
        fr: "rue",
    },
    Street: {
        en: "Street",
        nl: "Straat",
        fr: "Rue",
    },
    zip: {
        en: "zip",
        nl: "postcode",
        fr: "code postal",
    },
    Zip: {
        en: "Postal code",
        nl: "Postcode",
        fr: "Code postal",
    },
}
const { translateMessage } = useLang()
const tm = computed(() => (key: string) => translateMessage(translations[key]!))
</script>
