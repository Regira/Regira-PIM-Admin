<template>
    <ul v-if="navbarTree?.length" class="navbar-nav me-auto mb-lg-0 px-2 p-md-0">
        <template v-for="node in navbarTree.roots" :key="node.value.id">
            <NavBarItem :node="node" @select="$emit('select', $event)" />
        </template>
    </ul>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { NavItem } from "regira_modules/vue/entities"
import { useNavigation } from "../functions"
import NavBarItem from "./NavBarItem.vue"

defineEmits<{
    (e: "select", id: string): void
}>()

const { navbarTree } = useNavigation()
const navItems = computed(() => navbarTree.value.filter((n) => n.value instanceof NavItem).map((n) => n.value))

defineExpose({
    tree: navbarTree,
    items: navItems,
})
</script>
