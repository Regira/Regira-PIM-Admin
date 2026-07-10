<template>
    <div class="buttons-row d-flex flex-wrap gap-2">
        <IconButton v-if="isArchived" type="button" icon="restore" class="btn-warning py-1" :disabled="busy" @click="emit('restore')">
            <span class="d-none d-md-inline ms-1">{{ $t("restore") }}</span>
        </IconButton>
        <template v-else>
            <IconButton type="submit" icon="save" class="btn-primary py-1" :disabled="readonly || busy">
                <span class="d-none d-md-inline ms-1">{{ $t("save") }}</span>
            </IconButton>
            <IconButton type="button" icon="cancel" class="btn-secondary py-1" :disabled="readonly" @click="emit('cancel')">
                <span class="d-none d-md-inline ms-1">{{ $t("reset") }}</span>
            </IconButton>
            <ConfirmButton
                v-if="showDelete"
                type="button"
                :modal-type="ModalType.danger"
                :modal-title="$t('removeItem?')"
                class="btn-danger py-1"
                :disabled="readonly"
                @confirm="emit('remove')"
            >
                <template #button-content>
                    <Icon name="delete" />
                    <span class="d-none d-md-inline ms-1">{{ $t("delete") }}</span>
                </template>
                <slot name="delete">{{ $t("deleteItem", { title: item?.$title }) }}</slot>
            </ConfirmButton>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ConfirmButton, ModalType, FeedbackStatus, type FeedbackOut } from "regira_modules/vue/ui"
import type { IEntity } from "regira_modules/vue/entities"

// Local variant of regira_modules/vue/ui FormButtonsRow: same props/events, but labels and the
// delete-confirm texts go through $t (en/fr/nl) and an archived item shows only Restore.
// Replace with the library component once it exposes label overrides.
const emit = defineEmits<{ cancel: []; remove: []; restore: [] }>()
const props = withDefaults(
    defineProps<{
        item?: IEntity
        readonly?: boolean
        feedback: FeedbackOut
        showDelete?: boolean
    }>(),
    { showDelete: true }
)

// truthy check: soft-delete flags may arrive as 0/1 instead of booleans
const isArchived = computed(() => !!(props.item as { isArchived?: number | boolean } | undefined)?.isArchived)
// disable submit/restore while a save/delete is in flight (or just succeeded) to block double-submits
const busy = computed(() => {
    const s = props.feedback.status.value
    return s !== FeedbackStatus.none && s !== FeedbackStatus.failed
})
</script>
