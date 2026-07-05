<template>
    <li class="nav-item" :class="{ dropdown: isGroup }">
        <template v-if="isGroup">
            <template v-if="node.children.length">
                <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    id="navbarAccountDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    @click="handleToggleDropDown"
                >
                    <icon :name="node.value.icon ?? ''" />
                    <span class="d-none d-md-inline d-xl-none ms-2">{{ $t(node.value.description ?? node.value.title) }}</span>
                    <span class="d-md-none d-xl-inline ms-2">{{ $t(node.value.title) }}</span>
                </a>

                <ul class="dropdown-menu dropdown-menu-end" :class="{ show: showDropDown }" v-click-outside="handleCloseDropDown">
                    <li v-for="child in node.children" :key="child.value.id" class="nav-item dropdown">
                        <NavBarItemLink
                            :item="child.value as INavItem"
                            class="btn btn-link dropdown-item"
                            @select="
                                (e) => {
                                    showDropDown = false
                                    $emit('select', e)
                                }
                            "
                        >
                            <span class="ms-2">{{ $t(child.value.title) }}</span>
                        </NavBarItemLink>
                    </li>
                </ul>
            </template>
        </template>
        <template v-else>
            <NavBarItemLink :item="navItem" class="nav-link" @select="$emit('select', $event)" />
        </template>
    </li>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import type { TreeNode } from "regira_modules/treelist"
import { type INavCore, type INavItem, isNavItem } from "regira_modules/vue/entities"
import NavBarItemLink from "./NavBarItemLink.vue"

defineEmits<{
    (e: "select", id: string): void
}>()

const props = defineProps<{
    node: TreeNode<INavCore>
}>()

const isGroup = computed(() => !isNavItem(props.node.value))
const navItem = computed(() => props.node.value as INavItem)

const showDropDown = ref(false)
const handleToggleDropDown = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    showDropDown.value = !showDropDown.value
}
function handleCloseDropDown() {
    showDropDown.value = false
}
</script>
