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
        </div>
        <div class="row">
            <!-- title -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="title" />
                    </div>
                    <input v-model.lazy.trim="searchObject.title" class="form-control" :placeholder="$t('name')" />
                </div>
            </div>
        </div>
        <div class="row">
            <!-- parentFacet -->
            <div class="col mb-2">
                <FacetInputSelector v-model="parentFacet" v-model:idValue="searchObject.parentFacetId as number" :canEdit="false" />
                <FormLabel :label="$t('facet.parentFacet')" />
            </div>
            <!-- childFacet -->
            <div class="col mb-2">
                <FacetInputSelector v-model="childFacet" v-model:idValue="searchObject.childFacetId as number" :canEdit="false" />
                <FormLabel :label="$t('facet.childFacet')" />
            </div>
        </div>
        <div class="row">
            <!-- parentFacetGroup -->
            <div class="col mb-2">
                <FacetGroupInputSelector v-model="parentFacetGroup" v-model:idValue="searchObject.parentGroupId as number" :canEdit="false" />
                <FormLabel :label="$t('facet.parentFacetGroup')" />
            </div>
            <!-- childFacetGroup -->
            <div class="col mb-2">
                <FacetGroupInputSelector v-model="childFacetGroup" v-model:idValue="searchObject.childGroupId as number" :canEdit="false" />
                <FormLabel :label="$t('facet.childFacetGroup')" />
            </div>
        </div>
        <div class="row">
            <div class="col mb-2">
                <div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isRoot" id="isRoot" class="form-check-input" />
                        <label class="form-check-label" for="isRoot">{{ $t("isRoot") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isParent" id="isParent" class="form-check-input" />
                        <label class="form-check-label" for="isParent">{{ $t("facet.isParent") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isChild" id="isChild" class="form-check-input" />
                        <label class="form-check-label" for="isChild">{{ $t("facet.isChild") }}</label>
                    </div>
                </div>
                <FormLabel :label="$t('assembly')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { useFilter, type FilterEmits } from "regira_modules/vue/entities"
import type Facet from "../data/Entity"
import FacetInputSelector from "../selecting/InputSelector.vue"
import useEntityStore from "../data/store"
import { type Entity as FacetGroup, InputSelector as FacetGroupInputSelector, useEntityStore as useFacetGroupStore } from "@/entities/facet-groups"
import SearchObject from "./SearchObject"

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

const parentFacet = ref<Facet>()
const childFacet = ref<Facet>()
const parentFacetGroup = ref<FacetGroup>()
const childFacetGroup = ref<FacetGroup>()

const { filterIsActive, handleReset } = useFilter({
    searchObject,
    emit,
    Constructor: SearchObject,
})

const { service: facetService } = useEntityStore()
const { service: facetGroupService } = useFacetGroupStore()

watchEffect(async () => {
    if (searchObject.value.parentFacetId != null && parentFacet.value == null) {
        const items = await facetService.list({ ids: [searchObject.value.parentFacetId as number] })
        parentFacet.value = items[0]
    }
})
watchEffect(async () => {
    if (searchObject.value.childFacetId != null && childFacet.value == null) {
        const items = await facetService.list({ ids: [searchObject.value.childFacetId as number] })
        childFacet.value = items[0]
    }
})
watchEffect(async () => {
    if (searchObject.value.parentGroupId != null && parentFacetGroup.value == null) {
        const items = await facetGroupService.list({ ids: [searchObject.value.parentGroupId as number] })
        parentFacetGroup.value = items[0]
    }
})
watchEffect(async () => {
    if (searchObject.value.childGroupId != null && childFacetGroup.value == null) {
        const items = await facetGroupService.list({ ids: [searchObject.value.childGroupId as number] })
        childFacetGroup.value = items[0]
    }
})
</script>
