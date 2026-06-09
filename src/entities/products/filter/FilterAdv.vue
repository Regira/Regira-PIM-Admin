<template>
    <div class="adv-filter">
        <div class="row">
            <div class="col mb-2" v-if="resultCount != null">
                <span class="text-info">{{ resultCount }} results</span>
                <small v-if="filterIsActive" class="ms-2 italic-muted">({{ $t("filtersAreApplied") }})</small>
                <span v-if="isLoading" class="ms-2 text-muted"><Loading style="height: 1.5rem" /></span>
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
                <FormLabel :label="$t('keywords')" />
            </div>
            <!-- title -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="search" />
                    </div>
                    <input v-model.lazy.trim="searchObject.title" class="form-control" :placeholder="$t('name')" />
                </div>
                <FormLabel :label="$t('name')" />
            </div>
        </div>
        <div class="row">
            <!-- isRoot, isAssembly, isComponent -->
            <div class="col mb-2">
                <div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isRoot" id="isRoot" class="form-check-input" />
                        <label class="form-check-label" for="isRoot">{{ $t("isRoot") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isAssembly" id="isAssembly" class="form-check-input" />
                        <label class="form-check-label" for="isAssembly">{{ $t("product.isAssembly") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isComponent" id="isComponent" class="form-check-input" />
                        <label class="form-check-label" for="isComponent">{{ $t("product.isComponent") }}</label>
                    </div>
                </div>
                <FormLabel :label="$t('assembly')" />
            </div>
            <!-- UnitType -->
            <div class="col mb-2">
                <UnitTypeInputSelector
                    v-model="unitType"
                    v-model:id-value="searchObject.unitTypeId"
                    :placeholder="$t('unitType')"
                    @select="handleFilter"
                />
                <FormLabel :label="$t('unitType')" />
            </div>
        </div>
        <div class="row">
            <!-- Component -->
            <div class="col mb-2">
                <InputSelector
                    v-model="component"
                    v-model:idValue="searchObject.componentId as number"
                    :canEdit="false"
                    :filterDefaults="{ isComponent: true }"
                    :placeholder="$t('product.component')"
                    @select="handleFilter"
                >
                    <template #prepend>
                        <span class="input-group-text">
                            <Icon name="component" />
                        </span>
                    </template>
                </InputSelector>
                <FormLabel :label="$t('product.component')" />
            </div>
            <!-- Assembly -->
            <div class="col mb-2">
                <InputSelector
                    v-model="assembly"
                    v-model:idValue="searchObject.assemblyId as number"
                    :canEdit="false"
                    :filterDefaults="{ isAssembly: true }"
                    :placeholder="$t('product.assembly')"
                    @select="handleFilter"
                >
                    <template #prepend>
                        <span class="input-group-text">
                            <Icon name="assembly" />
                        </span>
                    </template>
                </InputSelector>
                <FormLabel :label="$t('product.assembly')" />
            </div>
        </div>
        <div class="row">
            <!-- Facet Group -->
            <div class="col mb-2">
                <FacetGroupInputSelector
                    v-model="facetGroup"
                    v-model:idValue="searchObject.facetGroupId as number"
                    :canEdit="false"
                    :placeholder="$t('product.facetGroup')"
                    @select="handleFilter"
                >
                    <template #prepend>
                        <span class="input-group-text bg-success bg-opacity-25">
                            <Icon :name="facetGroupConfig.key" />
                        </span>
                    </template>
                </FacetGroupInputSelector>
                <FormLabel :label="$t('product.facetGroup')" />
            </div>
            <!-- Exclude Facet Group -->
            <div class="col mb-2">
                <FacetGroupInputSelector
                    v-model="excludeFacetGroup"
                    v-model:idValue="searchObject.excludeFacetGroupId as number"
                    :canEdit="false"
                    :placeholder="$t('product.facetGroup')"
                    @select="handleFilter"
                >
                    <template #prepend>
                        <span class="input-group-text bg-danger bg-opacity-25">
                            <Icon :name="facetGroupConfig.key" />
                        </span>
                    </template>
                </FacetGroupInputSelector>
                <FormLabel :label="$t('product.excludedFacetGroup')" />
            </div>
        </div>
        <div class="row">
            <!-- All Components -->
            <div class="col">
                <div class="row">
                    <div class="col-auto mb-2" v-for="c in allComponents" :key="c.id">
                        <div class="input-group mt-1">
                            <span class="input-group-text bg-success bg-opacity-50">
                                <Icon name="check" />
                            </span>
                            <div class="form-control">{{ c.$title }}</div>
                            <button class="btn btn-outline-secondary" @click="handleRemoveComponent(c)">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>
                    <div class="col-auto">
                        <InputSelector
                            @select="handleAddComponent"
                            :canEdit="false"
                            :filter-defaults="{ isComponent: true }"
                            :placeholder="$t('product.addComponent')"
                        >
                            <template #prepend>
                                <span class="input-group-text bg-success bg-opacity-25">
                                    <Icon name="component" />
                                </span>
                            </template>
                        </InputSelector>
                    </div>
                </div>
                <FormLabel :label="$t('product.allComponents')" />
            </div>
            <!-- Exclude Components -->
            <div class="col">
                <div class="row">
                    <div class="col-auto mb-2" v-for="c in excludeComponents" :key="c.id">
                        <div class="input-group mt-1">
                            <span class="input-group-text bg-danger bg-opacity-50">
                                <Icon name="ban" />
                            </span>
                            <div class="form-control">{{ c.$title }}</div>
                            <button class="btn btn-outline-secondary" @click="handleRemoveExcludedComponent(c)">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>
                    <div class="col-auto">
                        <InputSelector
                            @select="handleAddExcludedComponent"
                            :canEdit="false"
                            :filter-defaults="{ isComponent: true }"
                            :placeholder="$t('product.addComponent')"
                        >
                            <template #prepend>
                                <span class="input-group-text bg-danger bg-opacity-25">
                                    <Icon name="component" />
                                </span>
                            </template>
                        </InputSelector>
                    </div>
                </div>
                <FormLabel :label="$t('product.excludedComponents')" />
            </div>
        </div>
        <div class="row">
            <!-- All Facets -->
            <div class="col">
                <div class="row">
                    <div class="col-auto mb-2" v-for="f in allFacets" :key="f.id">
                        <div class="input-group mt-1">
                            <span class="input-group-text bg-success bg-opacity-50">
                                <Icon name="check" />
                            </span>
                            <div class="form-control">{{ f.$title }}</div>
                            <button class="btn btn-outline-secondary" @click="handleRemoveFacet(f)">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>
                    <div class="col-auto">
                        <FacetInputSelector @select="handleAddFacet" :canEdit="false" :placeholder="$t('product.addFacet')">
                            <template #prepend>
                                <span class="input-group-text bg-success bg-opacity-25">
                                    <Icon :name="facetConfig.key" />
                                </span>
                            </template>
                        </FacetInputSelector>
                    </div>
                </div>
                <FormLabel :label="$t('product.allFacets')" />
            </div>
            <!-- Exclude Facets -->
            <div class="col">
                <div class="row">
                    <div class="col-auto mb-2" v-for="f in excludeFacets" :key="f.id">
                        <div class="input-group mt-1">
                            <span class="input-group-text bg-danger bg-opacity-50">
                                <Icon name="ban" />
                            </span>
                            <div class="form-control">{{ f.$title }}</div>
                            <button class="btn btn-outline-secondary" @click="handleRemoveExcludedFacet(f)">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>
                    <div class="col-auto">
                        <FacetInputSelector @select="handleAddExcludedFacet" :canEdit="false" :placeholder="$t('product.addFacet')">
                            <template #prepend>
                                <span class="input-group-text bg-danger bg-opacity-25">
                                    <Icon :name="facetConfig.key" />
                                </span>
                            </template>
                        </FacetInputSelector>
                    </div>
                </div>
                <FormLabel :label="$t('product.excludedFacets')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from "vue"
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import { config as unitTypeConfig, type Entity as UnitType, InputSelector as UnitTypeInputSelector } from "@/entities/unit-types"
import { config as facetConfig, type Entity as Facet, InputSelector as FacetInputSelector, useEntityStore as useFacetStore } from "@/entities/facets"
import { config as facetGroupConfig, type Entity as FacetGroup, InputSelector as FacetGroupInputSelector } from "@/entities/facet-groups"
import SearchObject from "./SearchObject"
import InputSelector from "../selecting/InputSelector.vue"
import Product from "../data/Entity"
import useEntityStore from "../data/store"

interface Emits extends /* @vue-ignore */ FilterEmits {}
const emit = defineEmits<
    Emits & {
        "update:modelValue": (value: SearchObject) => true
        filter: (value: SearchObject) => true
    }
>()

const props = defineProps<{
    resultCount?: number
    isLoading?: boolean
}>()

const searchObject = defineModel<SearchObject>({ required: true })

const unitType = ref<UnitType>()
const component = ref<Product>()
const assembly = ref<Product>()
const facetGroup = ref<FacetGroup>()
const excludeFacetGroup = ref<FacetGroup>()
const allComponents = ref<Array<Product>>()
const excludeComponents = ref<Array<Product>>()
const allFacets = ref<Array<Facet>>()
const excludeFacets = ref<Array<Facet>>()

const {
    filterIsActive,
    handleReset: handleProductReset,
    handleFilter,
} = useFilter({
    searchObject,
    emit,
    Constructor: SearchObject,
})

function handleReset() {
    handleProductReset()
    unitType.value = undefined
    component.value = undefined
    assembly.value = undefined
    facetGroup.value = undefined
    excludeFacetGroup.value = undefined
    allComponents.value = undefined
    excludeComponents.value = undefined
    allFacets.value = undefined
    excludeFacets.value = undefined
}

watch(allComponents, () => {
    searchObject.value = {
        ...searchObject.value,
        allComponentId: allComponents.value?.map((c) => c.id),
    }
    emit("filter", searchObject.value)
})
watch(excludeComponents, () => {
    searchObject.value = {
        ...searchObject.value,
        excludeComponentId: excludeComponents.value?.map((c) => c.id),
    }
    emit("filter", searchObject.value)
})
watch(allFacets, () => {
    searchObject.value = {
        ...searchObject.value,
        allFacetId: allFacets.value?.map((f) => f.id),
    }
    emit("filter", searchObject.value)
})
watch(excludeFacets, () => {
    searchObject.value = {
        ...searchObject.value,
        excludeFacetId: excludeFacets.value?.map((f) => f.id),
    }
    emit("filter", searchObject.value)
})

function handleAddComponent(product?: Product) {
    if (product && !allComponents.value?.some((c) => c.id === product.id)) {
        allComponents.value = [...(allComponents.value ?? []), product]
    }
}
function handleRemoveComponent(product: Product) {
    allComponents.value = allComponents.value?.filter((c) => c.id !== product.id)
}
function handleAddExcludedComponent(product?: Product) {
    if (product && !excludeComponents.value?.some((c) => c.id === product.id)) {
        excludeComponents.value = [...(excludeComponents.value ?? []), product]
    }
}
function handleRemoveExcludedComponent(product: Product) {
    excludeComponents.value = excludeComponents.value?.filter((c) => c.id !== product.id)
}
function handleAddFacet(facet?: Facet) {
    if (facet && !allFacets.value?.some((f) => f.id === facet.id)) {
        allFacets.value = [...(allFacets.value ?? []), facet]
    }
}
function handleRemoveFacet(facet: Facet) {
    allFacets.value = allFacets.value?.filter((f) => f.id !== facet.id)
}
function handleAddExcludedFacet(facet?: Facet) {
    if (facet && !excludeFacets.value?.some((f) => f.id === facet.id)) {
        excludeFacets.value = [...(excludeFacets.value ?? []), facet]
    }
}
function handleRemoveExcludedFacet(facet: Facet) {
    excludeFacets.value = excludeFacets.value?.filter((f) => f.id !== facet.id)
}

const { service } = useEntityStore()
const { service: facetService } = useFacetStore()
watchEffect(async () => {
    if (searchObject.value.allComponentId != null && allComponents.value == null) {
        allComponents.value = await service.list({ ids: searchObject.value.allComponentId as number[] })
    }
})
watchEffect(async () => {
    if (searchObject.value.excludeComponentId != null && excludeComponents.value == null) {
        excludeComponents.value = await service.list({ ids: searchObject.value.excludeComponentId as number[] })
    }
})
watchEffect(async () => {
    const hasFacetId =
        searchObject.value.allFacetId != null &&
        (!Array.isArray(searchObject.value.allFacetId) || (searchObject.value.allFacetId as Array<number>)?.length)

    if (hasFacetId && allFacets.value == null) {
        allFacets.value = await facetService.list({ ids: searchObject.value.allFacetId as number[] })
    }
})
watchEffect(async () => {
    const hasExcludeFacetId =
        searchObject.value.excludeFacetId != null &&
        (!Array.isArray(searchObject.value.excludeFacetId) || (searchObject.value.excludeFacetId as Array<number>)?.length)
    if (hasExcludeFacetId && excludeFacets.value == null) {
        console.debug("Loading excluded facets", searchObject.value.excludeFacetId)
        excludeFacets.value = await facetService.list({ ids: searchObject.value.excludeFacetId as number[] })
    }
})
</script>
