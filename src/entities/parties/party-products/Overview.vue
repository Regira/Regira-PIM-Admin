<template>
    <FormSection :title="$t('products')">
        <Filter
            v-if="items && items.length > 0"
            v-model="searchObject"
            @filter="searchHandler(true)"
            @change="searchHandler(true)"
            :result-count="itemsCount"
        />
        <LoadingContainer :is-loading="isLoading">
            <List
                v-if="items && items.length > 0"
                :modelValue="items"
                :is-loading="isLoading"
                :feedback="feedback"
                @request-save="handleRequestSave"
                @request-remove="handleRequestRemove"
                @save="handleSave"
                @remove="handleRemove"
            />
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
import List from "@/entities/products/overview/List.vue"
import Filter from "@/entities/products/filter/Filter.vue"
import type Entity from "@/entities/products/data/Entity"
import useEntityStore from "@/entities/products/data/store"
import type Party from "../data/Entity"

const props = defineProps<{
    party: Party
}>()

const { service } = useEntityStore()
const { searchObject, pagingInfo, items, itemsCount, isLoading, feedback, applySave, applyRemove, handleSave, handleRemove, searchHandler } =
    useSearchView<Entity>({
        service,
        searchObject: { supplierId: props.party.id },
        defaultPageSize: 10,
    })

async function handleRequestSave(item: Entity) {
    const result = await applySave(item)
    if (result != null) {
        handleSave(result)
    }
}
async function handleRequestRemove(item: Entity) {
    await applyRemove(item)
    handleRemove(item)
}

onMounted(async () => {
    searchHandler(true)
})
</script>
