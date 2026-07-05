<template>
    <div>
        <Draggable v-model="items" item-key="id" handle=".drag-handle" ghost-class="ghost" @end="handleSort">
            <template #item="{ element, index }">
                <Form v-model="items[index]!" :class="{ 'is-deleted': element._deleted }" @save="onSave" />
            </template>
        </Draggable>
        <FormModalButton v-model="newItem" @save="onSave" @cancel="onCancel" />
        <Form v-model="newItem" @save="onSave" ref="newItemInput" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Draggable from "vuedraggable"
import { useListInput, type SaveResult } from "regira_modules/vue/entities"
import type Entity from "./Entity"
import Form from "./Form.vue"
import FormModalButton from "./FormModalButton.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args: Array<Entity>): void
    (e: "sort", args: any): void
}>()
const props = withDefaults(
    defineProps<{
        modelValue?: Array<Entity>
    }>(),
    {
        modelValue: () => [],
    }
)

const newItemInput = ref<null | { focus(): void }>(null)
const { items, newItem, handleSort, handleSave } = useListInput<Entity>({
    props,
    emit,
})

function onSave(e: SaveResult<Entity>) {
    handleSave(e)
    newItemInput?.value?.focus()
}
function onCancel() {
    newItem.value = { id: 0 } as Entity
}
</script>
