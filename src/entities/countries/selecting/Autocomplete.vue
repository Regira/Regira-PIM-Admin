<template>
    <Autocomplete
        :search="search"
        :max-results="maxResults"
        :id-selector="idSelector"
        :display-item-formatter="displayItemFormatter"
        :placeholder="placeholder"
        ref="autoEl"
    >
        <template #default="{ item, q }">
            <div class="w-100 d-flex justify-content-between">
                <div>{{ item?.$title }}</div>
                <div>{{ item?.code }}</div>
            </div>
        </template>
    </Autocomplete>
</template>

<script setup lang="ts">
import { type Ref, ref, computed } from "vue"
import { Autocomplete } from "regira_modules/vue/ui"
import { getInitials } from "regira_modules/vue/formatters"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"

const props = withDefaults(
    defineProps<{
        maxResults?: number
        filterDefaults?: Record<string, any>
        placeholder?: string
    }>(),
    { maxResults: 10 }
)

const { fromCache } = useEntityStore()
const items = computed<Array<Entity>>(() => (fromCache() as Array<Ref<Entity>>).map((x: Ref<Entity>) => x.value))

const search = (q: string = "") =>
    Promise.resolve(
        items.value
            .filter((itemRef) => {
                const upperQ = q.toUpperCase()
                const keywords = upperQ.split(" ")
                return !q || keywords.some((kw) => itemRef.title!.toUpperCase().includes(kw)) || getInitials(itemRef.title!).startsWith(upperQ)
            })
            .slice(0, props.maxResults)
    )
const idSelector = (item?: Entity) => item?.id as string
const displayItemFormatter = (item?: Entity) => item?.title as string

// expose refs
const autoEl = ref<any>(null)
defineExpose({
    autoEl,
    get inputEl() {
        return autoEl.value.inputEl
    },
    resetQ: () => autoEl.value.resetQ(),
    search: (q?: string) => autoEl.value.search(q),
    reset: () => autoEl.value.reset(),
})
</script>
