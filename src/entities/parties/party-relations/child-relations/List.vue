<template>
    <div>
        <Draggable
            class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-2"
            v-model="items"
            item-key="id"
            handle=".drag-handle"
            ghost-class="ghost"
        >
            <template #item="{ element, index }">
                <div class="col">
                    <ListItem v-model="items[index]!" :parent="parent" :class="{ 'is-deleted': element._deleted }" />
                </div>
            </template>
        </Draggable>
    </div>
</template>

<script setup lang="ts">
import Draggable from "vuedraggable"
import type Party from "../../data/Entity"
import type Entity from "../Entity"
import ListItem from "./ListItem.vue"

defineProps<{
    parent: Party
}>()

const items = defineModel<Array<Entity>>({ default: () => [] })
</script>
