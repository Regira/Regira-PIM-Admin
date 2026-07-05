<template>
    <div class="adv-filter">
        <div class="row">
            <div class="col mb-2" v-if="resultCount != null">
                <span class="text-info">{{ resultCount }} results</span>
                <small v-if="filterIsActive" class="ms-2 italic-muted">({{ $t("filtersAreApplied") }})</small>
            </div>
            <div class="col mb-2 text-end">
                <IconButton icon="clear" @click="handleReset" :showText="true" />
            </div>
        </div>
        <div class="row">
            <!-- keywords -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="search" />
                    </div>
                    <input v-model.lazy.trim="searchObject.q" class="form-control" :placeholder="$t('keywords')" />
                </div>
            </div>
        </div>
        <div class="row">
            <!-- title -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="title" />
                    </div>
                    <input v-model.lazy.trim="searchObject.title" class="form-control" :placeholder="$t('name')" />
                </div>
            </div>
        </div>
        <div class="row">
            <!-- minCreated -->
            <div class="col-sm mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="from" />
                    </div>
                    <input type="date" v-model="searchObject.minCreated" class="form-control" />
                </div>
            </div>
            <!-- maxCreated -->
            <div class="col-sm mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="to" />
                    </div>
                    <input type="date" v-model="searchObject.maxCreated" class="form-control" />
                </div>
            </div>
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

const searchObject = defineModel<SearchObject>({ required: true })

const { filterIsActive, handleReset } = useFilter({
    searchObject,
    emit,
    Constructor: SearchObject,
})
</script>
