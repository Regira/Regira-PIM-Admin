<template>
    <FormSection :title="$t('assemblies')">
        <Filter v-model="searchObject" @filter="searchHandler(true)" @change="searchHandler(true)" :result-count="itemsCount" />
        <LoadingContainer :is-loading="isLoading">
            <List :modelValue="items" :product="product" :is-loading="isLoading" :feedback="feedback" @remove="applyRemove" />
            <p v-if="items && items.length <= 0" class="italic-muted">
                {{ $t("noResults") }}
            </p>
        </LoadingContainer>
        <div class="row">
            <div class="col order-2">
                <template v-if="pagingInfo != null">
                    <Paging
                        class="mt-2"
                        v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!"
                        v-model="pagingInfo"
                        :count="itemsCount || 0"
                        :buttonType="ButtonType.button"
                        @change="searchHandler(false)"
                    />
                </template>
            </div>
            <div class="col-12 col-sm-auto order-1 order-sm-3">
                <ResultSummary v-if="items?.length" :visibleCount="items.length" :totalCount="itemsCount" />
            </div>
        </div>
        <Debug
            :modelValue="{
                searchObject,
                pagingInfo,
                items,
            }"
        />
    </FormSection>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import ResultSummary from "@/components/ResultSummary.vue"
import { ButtonType } from "regira_modules/vue/ui"
import { useSearchView } from "regira_modules/vue/entities"
import List from "./List.vue"
import Filter from "../filter/Filter.vue"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"

const props = defineProps<{
    product: Entity
}>()

const { service } = useEntityStore()
const { searchObject, pagingInfo, items, itemsCount, isLoading, feedback, applyRemove, searchHandler } = useSearchView({
    service,
    searchObject: { componentId: props.product.id, includes: ["Components"] },
    defaultPageSize: 10,
})

onMounted(async () => {
    searchHandler(true)
})
</script>
