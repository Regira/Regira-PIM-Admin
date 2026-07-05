<template>
    <div class="container-fluid m-0 p-0" :class="{ 'border opacity-75': isDragging }" @drop="handleDrop" @dragover.prevent="() => {}">
        <div class="row g-0 hover-line">
            <div class="col-auto">
                <button type="button" :disabled="!node.children.length" class="btn btn-default border-0 p-1 me-1" @click="$emit('toggle-node', node)">
                    <Icon :name="node.value.isExpanded || !node.children.length ? 'minus' : 'new'" />
                </button>
                <FormModalButton :modelValue="nodeItem" initial-tab="form" class="btn btn-default border-0 p-1 me-1" :disabled="isSelected" />
            </div>
            <div class="col text-truncate">
                <span
                    draggable="true"
                    class="d-inline-block p-1 cursor move"
                    :class="{ 'fw-bold': isSelected }"
                    @dragstart="() => $emit('drag', node)"
                    @dragend="() => $emit('dragend')"
                >
                    {{ nodeItem?.title }}
                </span>
            </div>
            <!-- <div class="col-auto">
                <SelectorModalButton
                    :item-defaults="childItemDefaults"
                    class="btn btn-default border-0 py-1 px-2 mt-1 ms-1 bg-light"
                    :title="`add child to ${nodeItem?.title}`"
                    @select="handleAddChild"
                >
                    <Icon name="new" />
                </SelectorModalButton>
            </div> -->
        </div>
        <template v-if="nodeFacets?.length">
            <ul class="list-unstyled tree-indent opacity-50 text-truncate">
                <li v-for="facet in nodeFacets" :key="`${node.value.id}_${facet.id}`">
                    <FacetButton :modelValue="facet" class="p-1" /> {{ facet.title }}
                </li>
            </ul>
        </template>
        <template v-if="nodeSuppliers?.length">
            <ul class="list-inline tree-indent opacity-50 text-truncate">
                <li v-for="supplier in nodeSuppliers" :key="`${node.value.id}_${supplier.id}`" class="list-inline-item" :title="supplier.title">
                    <PartyButton :modelValue="supplier" class="p-1">
                        <Icon name="supplier" />
                    </PartyButton>
                    {{ supplier.code || supplier.$initials }}
                </li>
            </ul>
        </template>
        <TreeView
            v-show="node.value.isExpanded"
            :nodes="sortedChildren"
            :selected="selected"
            :facets="facets"
            :suppliers="suppliers"
            :engine="engine"
            class="tree-indent"
            @add-child="(child: Entity, parent?: Entity) => $emit('add-child', child, parent)"
            @toggle-node="$emit('toggle-node', $event)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { orderBy } from "regira_modules/utilities/array-utility"
import { type TreeNode } from "regira_modules/treelist"
import { type DragDropEmits, type DragDropEngine } from "regira_modules/vue/entities"
import { Entity, useEntityStore, FormModalButton } from "../"
import { Entity as Facet, FormModalButton as FacetButton } from "../../facets"
import { Entity as Party, FormModalButton as PartyButton } from "../../parties"
import type TreeItem from "./TreeItem"
import TreeView from "./TreeView.vue"

const emit = defineEmits<
    DragDropEmits & {
        (e: "add-child", child: Entity, parent?: Entity): void
        (e: "toggle-node", node: TreeNode<TreeItem>): void
    }
>()

const props = defineProps<{
    selected: Array<TreeNode<TreeItem>>
    node: TreeNode<TreeItem>
    isDragging?: boolean
    facets?: Record<number, Array<Facet>>
    suppliers?: Record<number, Array<Party>>
    engine: DragDropEngine
}>()

const { fromPool } = useEntityStore()
/*
const childItemDefaults = computed(() => ({
    parentEntities: [{ parentId: props.node.value.id, parent: props.node.value.item }],
}))

function handleAddChild(child?: Entity) {
    if (!child) {
        return
    }
    //props.node.value.isExpanded = true
    emit("add-child", child)
}
*/
function handleDrop(e: DragEvent) {
    //e.preventDefault()
    e.stopPropagation()
    //props.node.value.isExpanded = true
    emit("drop", props.node)
}

const nodeItem = computed(() => fromPool(props.node.value.item))
const isSelected = computed(() => props.selected.some((n: TreeNode<TreeItem>) => nodeItem.value?.id == n.value?.id))
const sortedChildren = computed(() => orderBy(props.node.children, (c) => c.value?.item?.title?.toUpperCase()))

const nodeFacets = computed(() => findItems(props.facets))
const nodeSuppliers = computed(() => findItems(props.suppliers))

function findItems<T>(items?: Record<number, Array<T>>) {
    if (items != null) {
        const self = items[props.node.value.id]
        if (self?.length || props.node.getAncestors().some((a) => items[a.value.id]?.length)) {
            return self
        }
    }
    return []
}
</script>
