<template>
    <FormSection :collapsed="isCollapsed">
        <template #title>
            <h3 class="p-2 mb-2" @click="isCollapsed = !isCollapsed"><Icon :name="node.value.icon ?? ''" class="me-1" /> {{ $t(node.value.title) }}</h3>
        </template>
        <div class="row">
            <template v-for="childNode in node.children" :key="childNode.value.id">
                <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-2">
                    <DashboardCard :node="childNode as TreeNode<INavItem>" />
                </div>
            </template>
        </div>
    </FormSection>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { TreeNode } from "regira_modules/treelist"
import type { INavCore, INavItem } from "regira_modules/vue/entities"
import DashboardCard from "./DashboardCard.vue"

const props = defineProps<{
    node: TreeNode<INavCore>
    isCollapsed?: boolean
}>()

const isCollapsed = ref(props.isCollapsed ?? false)
</script>
