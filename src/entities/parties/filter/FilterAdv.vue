<script setup lang="ts">
import { ref } from "vue"
import { useFilter, type FilterEmits } from "regira_modules/vue/entities"
import type Party from "../data/Entity"
import PartyTypes from "../data/PartyTypes"
import SearchObject from "./SearchObject"
import InputSelector from "../selecting/InputSelector.vue"

interface Emits extends /* @vue-ignore */ FilterEmits<SearchObject> {}
const emit = defineEmits<
    Emits & {
        "update:modelValue": (value: SearchObject) => true
        filter: (value: SearchObject) => true
        "toggle-adv": () => void
        close: () => void
    }
>()

const props = defineProps<{
    resultCount?: number
}>()

const searchObject = defineModel<SearchObject>({ required: true })
const ancestor = ref<Party>()
const offspring = ref<Party>()

const { filterIsActive, handleReset } = useFilter({
    searchObject,
    emit,
    Constructor: SearchObject,
})
</script>

<template>
    <div class="adv-filter">
        <div class="row">
            <div class="col mb-2" v-if="resultCount != null">
                <span class="text-info">{{ resultCount }} results</span>
                <small v-if="filterIsActive" class="ms-2 italic-muted">({{ $t("filtersAreApplied") }})</small>
            </div>
            <div class="col mb-2 text-end">
                <IconButton icon="clear" @click="handleReset" :showText="true" />
            </div>
        </div>
        <div class="row">
            <!-- keywords -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="search" />
                    </div>
                    <input v-model.lazy.trim="searchObject.q" class="form-control" :placeholder="$t('keywords')" />
                </div>
            </div>
            <!-- name -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="title" />
                    </div>
                    <input v-model.lazy.trim="searchObject.name" class="form-control" :placeholder="$t('name')" />
                </div>
            </div>
        </div>
        <div class="row">
            <!-- isRoot, isParent, isChild -->
            <div class="col mb-2">
                <div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isRoot" id="isRoot" class="form-check-input" />
                        <label class="form-check-label" for="isRoot">{{ $t("isRoot") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isParent" id="isParent" class="form-check-input" />
                        <label class="form-check-label" for="isParent">{{ $t("party.isParent") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isChild" id="isChild" class="form-check-input" />
                        <label class="form-check-label" for="isChild">{{ $t("party.isChild") }}</label>
                    </div>
                </div>
                <FormLabel :label="$t('party.relations')" />
            </div>
            <!-- partyType -->
            <div class="col mb-2">
                <select v-model="searchObject.partyType" class="form-select">
                    <option :value="undefined">{{ $t("common.allTypes") }}</option>
                    <option :value="PartyTypes.Person">{{ $t("party.person") }}</option>
                    <option :value="PartyTypes.Organization">
                        {{ $t("party.organization") }}
                    </option>
                </select>
            </div>
        </div>
        <div class="row">
            <!-- Ancestor -->
            <div class="col mb-2">
                <InputSelector
                    v-model="ancestor"
                    v-model:idValue="searchObject.ancestorId as number"
                    :canEdit="false"
                    :filterDefaults="{ isAncestor: true }"
                />
                <FormLabel :label="$t('party.parent')" />
            </div>
            <!-- Offspring -->
            <div class="col mb-2">
                <InputSelector
                    v-model="offspring"
                    v-model:idValue="searchObject.offspringId as number"
                    :canEdit="false"
                    :filterDefaults="{ isOffspring: true }"
                />
                <FormLabel :label="$t('party.child')" />
            </div>
        </div>
    </div>
</template>
