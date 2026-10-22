<template>
    <form class="d-flex" @submit.prevent="handleSearch" v-if="searchItemConfig">
        <input
            class="form-control me-2"
            type="search"
            v-model.trim="q"
            :placeholder="`Search ${searchItemConfig.overviewTitle}`"
            aria-label="Search"
        />
        <IconButton icon="search" class="btn-outline-primary" type="submit" />
    </form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter, type RouteLocationRaw } from "vue-router"
import { useNavigation } from "../functions"

const emit = defineEmits<{
    (e: "search", { q, type }: { q: string; type: string }): void
}>()

const router = useRouter()
const q = ref("")
const { searchItemConfig } = useNavigation()

function handleSearch() {
    if (searchItemConfig.value == null) {
        return
    }
    const searchEntityRoute: RouteLocationRaw = {
        name: `${searchItemConfig.value.key}Overview`,
        query: { q: q.value },
    }
    emit("search", { q: q.value, type: searchItemConfig.value.key })
    q.value = "" // clear search input
    router.push(searchEntityRoute)
}
</script>
