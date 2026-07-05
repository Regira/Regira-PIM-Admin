<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <PartyInputSelector v-model="newItem.child" v-model:idValue="newItem.childId" :filterDefaults="{ exclude: excludedIds }" />
            </div>
            <div class="col-auto">
                <RelationshipTypeSelector v-model="newItem.relationshipType" v-model:idValue="newItem.relationshipTypeId" />
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-success" :disabled="!newItem.childId" @click="handleAdd(newItem)">
                    <Icon name="new" />
                </button>
            </div>
        </div>

        <TabContainer :tabs="tabs">
            <template #all>
                <List v-if="items?.length" v-model="items" :parent="parent" />
                <p v-else class="italic-muted">{{ $t("noItems") }}</p>
            </template>
            <template #persons>
                <List v-if="personRelations?.length" v-model="personRelations" :parent="parent" />
                <p v-else class="italic-muted">{{ $t("noItems") }}</p>
            </template>
            <template #units>
                <List v-if="orgRelations?.length" v-model="orgRelations" :parent="parent" />
                <p v-else class="italic-muted">{{ $t("noItems") }}</p>
            </template>
        </TabContainer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { TabContainer, Tab } from "regira_modules/vue/ui"
import { useLang } from "regira_modules/vue/lang"
import Entity from "../Entity"
import PartyTypes from "../../data/PartyTypes"
import type Party from "../../data/Entity"
import RelationshipTypeSelector from "@/entities/party-relationship-types/selecting/InputSelector.vue"
import PartyInputSelector from "../../selecting/InputSelector.vue"
import List from "./List.vue"

const emit = defineEmits<{
    (e: "sort", args: any): void
}>()
const props = defineProps<{
    parent: Party
}>()

const { translate } = useLang()
const tabs = computed(() => [
    new Tab(translate("common.all"), "all"),
    new Tab(translate("party.people"), "persons"),
    new Tab(translate("party.units"), "units"),
])
const items = defineModel<Array<Entity>>({ default: () => [] })

const newItem = ref<Entity>(Entity.create({ parentId: props.parent.id }))
function handleAdd(item: Entity) {
    if (!item.childId) return
    items.value.push(Entity.create({ ...item }))
    newItem.value = Entity.create({ parentId: props.parent.id })
}

const excludedIds = computed(() => [props.parent.id, ...(items.value?.filter((x) => !x._deleted).map((x) => x.childId) ?? [])])
const personRelations = computed({
    get: () => items.value.filter((x) => x.parent?.partyType == PartyTypes.Person),
    set: (value) => (items.value = [...value, ...orgRelations.value]),
})
const orgRelations = computed({
    get: () => items.value.filter((x) => x.parent?.partyType == PartyTypes.Organization),
    set: (value) => (items.value = [...personRelations.value, ...value]),
})
</script>
