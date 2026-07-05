<template>
    <div class="container-fluid m-0 p-0" :class="{ 'border opacity-75': isDragging }" @drop="handleDrop" @dragover.prevent="() => {}">
        <div class="row g-0 hover-line">
            <div class="col-auto">
                <button type="button" :disabled="!node.children.length" class="btn btn-default border-0 p-1 me-1" @click="$emit('toggle-node', node)">
                    <Icon :name="node.value.isExpanded || !node.children.length ? 'minus' : 'new'" />
                </button>
                <FacetModalButton v-if="isFacet" :modelValue="nodeItem as Facet" class="btn btn-default border-0 p-1 me-1" :disabled="isSelected" />
                <FacetGroupModalButton v-else :modelValue="nodeItem as FacetGroup" class="btn btn-default border-0 p-1 me-1" :disabled="isSelected" />
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
            <div class="col-auto">
                <SelectorModalButton
                    :item-defaults="childItemDefaults"
                    class="btn btn-default border-0 py-1 px-2 mt-1 ms-1 bg-light"
                    :title="`add child to ${nodeItem?.title}`"
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
            @add-child="(child: Facet, parent?: Facet) => $emit('add-child', child, parent)"
            @toggle-node="$emit('toggle-node', $event)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { orderBy } from "regira_modules/utilities/array-utility"
import type { TreeNode } from "regira_modules/treelist"
import { type DragDropEmits, type DragDropEngine } from "regira_modules/vue/entities"
import { Entity as Facet, FormModalButton as FacetModalButton, useEntityStore as useFacetStore, SelectorModalButton } from "../../facets"
import { FormModalButton as FacetGroupModalButton, useEntityStore as useFacetGroupStore } from "../../facet-groups"
import type FacetGroup from "../../facet-groups/data/Entity"
import type TreeItem from "./TreeItem"
import TreeView from "./TreeView.vue"

const emit = defineEmits<
    DragDropEmits & {
        (e: "add-child", child: Facet, parent?: Facet): void
        (e: "toggle-node", node: TreeNode<TreeItem>): void
    }
>()

const props = defineProps<{
    selected: Array<TreeNode<TreeItem>>
    node: TreeNode<TreeItem>
    isDragging?: boolean
    engine: DragDropEngine
}>()

const { fromPool: fromFacetPool } = useFacetStore()
const { fromPool: fromFacetGroupPool } = useFacetGroupStore()

const isFacet = computed(() => props.node.value.type === Facet.name)

const nodeItem = computed(() => {
    if (isFacet.value) {
        return fromFacetPool(props.node.value.item as Facet)
    }
    return fromFacetGroupPool(props.node.value.item as FacetGroup)
})

const isSelected = computed(() =>
    props.selected.some((n: TreeNode<TreeItem>) => nodeItem.value?.id == n.value?.id && props.node.value.type == n.value?.type)
)
const sortedChildren = computed(() => orderBy(props.node.children, (c) => (c.value?.item as Facet | FacetGroup | undefined)?.title?.toUpperCase()))

const childItemDefaults = computed(() => ({
    parentEntities: [{ parentId: props.node.value.id, parent: props.node.value.item }],
}))
function handleAddChild(child?: Facet) {
    if (!child) {
        return
    }
    //props.node.value.isExpanded = true
    emit("add-child", child)
}
function handleDrop(e: DragEvent) {
    //e.preventDefault()
    e.stopPropagation()
    //props.node.value.isExpanded = true
    emit("drop", props.node)
}
</script>
