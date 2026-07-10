<template>
    <section>
        <div class="row">
            <div class="col-auto">
                <!-- Filter -->
                <Filter v-model="searchObject" :result-count="itemsCount" @filter="searchHandler(true)" @change="searchHandler(true)" />
            </div>
            <div class="col">
                <div class="position-relative h-100 overflow-hidden">
                    <Feedback v-bind="{ feedback }" :hideCloseButton="true" class="my-2" />
                    <div v-if="selected?.id" class="position-absolute is-selected d-inline-block py-2 pe-2">
                        <IconButton icon="selected" @click="handleSelect(undefined)" />
                        {{ selected.$title }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Paging - ResultSummary -->
        <div class="row">
            <div class="col order-2">
                <template v-if="pagingInfo != null">
                    <Paging
                        class="mt-2"
                        v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!"
                        v-model="pagingInfo"
                        :button-type="ButtonType.button"
                        :count="itemsCount || 0"
                        @change="searchHandler(false)"
                    />
                </template>
            </div>
            <div class="col-12 col-sm-auto order-1 order-sm-3">
                <ResultSummary v-if="items?.length" :visibleCount="items.length" :totalCount="itemsCount" />
            </div>
        </div>

        <!-- List - Loading -->
        <LoadingContainer :is-loading="isLoading">
            <slot name="list" :items="items" :search-object="searchObject" :paging-info="pagingInfo">
                <component
                    :is="List"
                    v-model="items"
                    :selected="selected"
                    @request-save="handleRequestSave"
                    @request-remove="handleRequestRemove"
                    @save="handleSave"
                    @remove="handleRemove"
                    @select="handleSelect"
                />
            </slot>
        </LoadingContainer>

        <!-- Paging -->
        <template v-if="pagingInfo != null">
            <Paging
                class="mt-2"
                v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!"
                v-model="pagingInfo"
                :button-type="ButtonType.button"
                :count="itemsCount || 0"
                @change="searchHandler(false)"
            />
        </template>

        <!-- <div v-if="$isDebug" class="debug text-muted">
      {{ items }}
    </div> -->
    </section>
</template>

<script setup lang="ts">
import { onMounted, type Ref } from "vue"
import { useSearchView } from "regira_modules/vue/entities"
import { Feedback, ButtonType, ResultSummary } from "regira_modules/vue/ui"
import config from "../config/config"
import Entity from "../data/Entity"
import SearchObject from "../filter/SearchObject"
import Filter from "../filter/Filter.vue"
import useEntityStore from "../data/store"
import List from "../selecting/SelectorList.vue"

const props = defineProps<{
    filterDefaults?: Record<string, any>
    pageSize?: number
}>()

const selected = defineModel<Entity>()

const { service, fromCache } = useEntityStore()

const { searchObject, pagingInfo, items, itemsCount, isLoading, feedback, applySave, applyRemove, handleSave, handleRemove, searchHandler } =
    useSearchView<Entity, SearchObject>({
        service,
        searchObject: Object.assign(new SearchObject(), props.filterDefaults || {}),
        defaultPageSize: props.pageSize || config.defaultPageSize,
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

function handleSelect(item?: Entity) {
    feedback.success(item != null ? `${item.$title} selected` : `selection removed`)
    selected.value = item
}

//onMounted(searchHandler)
onMounted(() => (items.value = (fromCache() as Array<Ref<Entity>>).map((x) => x.value)))
</script>
