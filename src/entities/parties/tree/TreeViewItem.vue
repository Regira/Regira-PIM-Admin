<template>
    <div class="container-fluid m-0 p-0" :class="{ 'border opacity-75': isDragging }" @drop="handleDrop" @dragover.prevent="() => {}">
        <div class="row g-0 hover-line">
            <div class="col-auto">
                <button type="button" :disabled="!node.children.length" class="btn btn-default border-0 p-1 me-1" @click="$emit('toggle-node', node)">
                    <Icon :name="node.value.isExpanded || !node.children.length ? 'minus' : 'new'" />
                </button>
                <PartyModalButton :modelValue="nodeItem" class="btn btn-default border-0 p-1 me-1" :disabled="isSelected" />
            </div>
            <div class="col text-truncate">
                <small v-if="relationshipType" class="text-muted me-1">{{ relationshipType.title }}</small>
                <span
                    draggable="true"
                    class="d-inline-block p-1 cursor move"
                    :class="{ 'fw-bold': isSelected }"
                    @dragstart="() => $emit('drag', node)"
                    @dragend="() => $emit('dragend')"
                >
                    {{ nodeItem?.$title }}
                </span>
            </div>
            <div class="col-auto">
                <SelectorModalButton
                    :item-defaults="childItemDefaults"
                    class="btn btn-default border-0 py-1 px-2 mt-1 ms-1 bg-light"
                    :title="`add child to ${nodeItem?.$title}`"
                    @select="handleAddChild"
                >
                    <Icon name="new" />
                </SelectorModalButton>
            </div>
        </div>
        <TreeView
            v-show="node.value.isExpanded"
            :nodes="sortedChildren"
            :selected="selected"
            :engine="engine"
            class="tree-indent"
            @add-child="(child: Party, parent?: Party) => $emit('add-child', child, parent)"
        @toggle-node="$emit('toggle-node', $event)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { orderBy } from "regira_modules/utilities/array-utility"
import type { TreeNode } from "regira_modules/treelist"
import { type DragDropEmits, type DragDropEngine } from "regira_modules/vue/entities"
import { Entity as Party, FormModalButton as PartyModalButton, SelectorModalButton, useEntityStore as usePartyStore } from "../../parties"
import type TreeItem from "./TreeItem"
import { ChildItem } from "./TreeItem"
import TreeView from "./TreeView.vue"

const emit = defineEmits<
    DragDropEmits & {
        (e: "add-child", child: Party, parent?: Party): void
        (e: "toggle-node", node: TreeNode<TreeItem>): void
    }
>()

const props = defineProps<{
    selected: Array<TreeNode<TreeItem>>
    node: TreeNode<TreeItem>
    isDragging?: boolean
    engine: DragDropEngine
}>()

const { fromPool } = usePartyStore()

const nodeItem = computed(() => fromPool(props.node.value.item as Party))

const relationshipType = computed(() => (props.node.value instanceof ChildItem ? props.node.value.relationshipType : undefined))

const isSelected = computed(() => props.selected.some((n: TreeNode<TreeItem>) => nodeItem.value?.id == n.value?.id))

const sortedChildren = computed(() => orderBy(props.node.children, (c) => (c.value?.item as Party | undefined)?.$title?.toUpperCase()))

const childItemDefaults = computed(() => ({
    parentRelationships: [{ parentId: props.node.value.id, parent: props.node.value.item }],
}))
function handleAddChild(child?: Party) {
    if (!child) {
        return
    }
    emit("add-child", child)
}
function handleDrop(e: DragEvent) {
    e.stopPropagation()
    emit("drop", props.node)
}
</script>
