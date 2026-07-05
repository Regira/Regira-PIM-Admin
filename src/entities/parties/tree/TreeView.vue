<template>
    <ul class="list-unstyled">
        <li v-for="node in nodes" :key="node.value.id">
            <TreeViewItem
                v-if="node.value?.item"
                :selected="selected"
                :node="node"
                :is-dragging="draggingNode == node"
                :engine="engine"
                @drag="handleDrag"
                @dragend="handleDragEnd"
                @drop="handleDrop"
                @add-child="(child: Entity, parent?: Entity) => emit('add-child', child, parent)"
                @toggle-node="$emit('toggle-node', $event)"
            />
        </li>
    </ul>
</template>

<script lang="ts">
import type { TreeNode } from "regira_modules/treelist"
import { useDragDrop, type DragDropEmits, type DragDropEngine } from "regira_modules/vue/entities"
import type Entity from "../data/Entity"
import type TreeItem from "./TreeItem"
import TreeViewItem from "./TreeViewItem.vue"

export default {
    name: "TreeView",
    components: { TreeViewItem },
}
</script>

<script setup lang="ts">
const emit = defineEmits<
    DragDropEmits & {
        (e: "add-child", child: Entity, parent?: Entity): void
        (e: "toggle-node", node: TreeNode<TreeItem>): void
    }
>()

const props = defineProps<{
    selected: Array<TreeNode<TreeItem>>
    nodes: Array<TreeNode<TreeItem>>
    engine?: DragDropEngine
}>()

const engine = props.engine || useDragDrop<TreeItem>({ emit })
const { draggingNode, handleDrag, handleDragEnd, handleDrop } = engine
</script>
