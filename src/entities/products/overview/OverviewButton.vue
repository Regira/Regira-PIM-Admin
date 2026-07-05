<template>
    <button type="button" class="btn btn-default" @click="open">
        <slot>
            <Icon :name="config.key" />
        </slot>
        <Teleport to="#modals">
            <MyModal
                :is-visible="isOpen"
                :title="modalTitle"
                :showFooter="false"
                :full-width="true"
                @close="close"
                @cancel="handleCancel"
                @submit="handleSubmit"
            >
                <Filter v-model="searchObject" @filter="searchHandler(true)" @change="searchHandler(true)" :result-count="itemsCount" />
                <LoadingContainer :is-loading="isLoading">
                    <List :modelValue="items" :is-loading="isLoading" :feedback="feedback" @remove="applyRemove" />
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
            </MyModal>
        </Teleport>
    </button>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useLang } from "regira_modules/vue/lang"
import { ButtonType, ResultSummary } from "regira_modules/vue/ui"
import { useSearchView } from "regira_modules/vue/entities"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import type SearchObject from "../filter/SearchObject"
import List from "./List.vue"
import Filter from "../filter/Filter.vue"

const props = defineProps<{
    modalTitle?: string
    modelValue?: Array<Entity>
    searchObject?: Partial<SearchObject>
}>()

const { translate } = useLang()

const isOpen = ref(false)
const modalTitle = computed(() => props.modalTitle || translate(config.overviewTitle ?? ""))

const { service } = useEntityStore()
const { searchObject, pagingInfo, items, itemsCount, isLoading, feedback, applyRemove, searchHandler } = useSearchView({
    service,
    searchObject: props.searchObject ?? {},
    defaultPageSize: config.defaultPageSize,
})

function open() {
    isOpen.value = true
}
function close() {
    isOpen.value = false
}
function handleCancel() {
    close()
}
function handleSubmit() {
    close()
}
</script>
