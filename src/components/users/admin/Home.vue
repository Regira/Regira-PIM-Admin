<template>
    <section>
        <UserInput @save="load" />

        <template v-if="items?.length">
            <ListItem v-for="(item, i) in items" :key="item.id!" v-model="items[i]!" />
        </template>

        <Debug :modelValue="{ items }" />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useAxios } from "regira_modules/vue/http"
import { useAuthStore } from "regira_modules/vue/auth"
import type PimUser from "./Entity"
import ListItem from "./ListItem.vue"
import UserInput from "./UserInput.vue"

const axios = useAxios()

const items = ref<Array<PimUser>>()

// trigger searchHandler when logging in or refreshing token
const authStore = useAuthStore()
authStore.$onAction(({ name, after }) => ["login", "refresh"].includes(name) && after(() => authStore.isAuthenticated && load()))

async function load() {
    const response = await axios.get("/users")
    items.value = response.data
}
onMounted(load)
</script>
