<template>
    <div class="row">
        <div class="col-auto">
            <div class="input-group">
                <IconButton icon="clear" class="btn-outline-secondary" @click="handleReset" />
                <input
                    v-model.lazy.trim="searchObject.q"
                    class="form-control"
                    :style="{ width: $screen.layout == 'xs' ? '10rem' : undefined }"
                    :placeholder="$t('keywords')"
                    @change="handleUpdate"
                />
                <IconButton icon="search" class="btn-outline-primary" @click="handleUpdate" />
            </div>
            <small v-if="filterIsActive" class="italic-muted">{{ $t("filtersAreApplied") }}</small>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFilter, type FilterEmits } from "regira_modules/vue/entities"
import SearchObject from "./SearchObject"

interface Emits extends /* @vue-ignore */ FilterEmits<SearchObject> {}
const emit = defineEmits<
    Emits & {
        "update:modelValue": (value: SearchObject) => true
        filter: (value: SearchObject) => true
        "toggle-adv": () => void
        close: () => void
    }
>()

const props = defineProps<{
    resultCount?: number
}>()
const searchObject = defineModel<SearchObject>({
    default: () => new SearchObject(),
})

const { filterIsActive, handleReset, handleUpdate } = useFilter({
    searchObject,
    emit,
    Constructor: SearchObject,
})
</script>
