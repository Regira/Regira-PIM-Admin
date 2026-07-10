<template>
    <form @submit.prevent="handleSubmit" :modelValue="item">
        <div class="row form-buttons">
            <div class="col col-md-auto order-1">
                <FormButtonsRow
                    :item="item"
                    :readonly="readonly"
                    :feedback="feedback"
                    :show-delete="item?.id > 0"
                    @cancel="handleCancel"
                    @remove="handleRemove"
                    @restore="handleRestore"
                />
            </div>
            <div class="col-auto order-2 order-md-3">
                <RouterLink
                    v-if="isPopup"
                    :to="{ name: `${config.key}Details`, params: { id: item.$id } }"
                    class="btn btn-default py-1"
                    target="_blank"
                    :title="$t('popOut')"
                >
                    <Icon name="popOut" />
                </RouterLink>
                <RouterLink v-else-if="overviewUrl" :to="overviewUrl" class="btn btn-info py-1">
                    <Icon name="list" />
                    <span class="d-none d-md-inline ms-1">{{ $t("overview") }}</span>
                </RouterLink>
            </div>
            <div class="col-md order-3 order-md-2">
                <Feedback :feedback="feedback" />
            </div>
        </div>

        <TabContainer :tabs="tabs" :active="initialTab" :use-route-nav="!isPopup">
            <template #form>
                <FormSection :title="$t(config.detailsTitle || '')" :readonly="readonly">
                    <div class="row">
                        <!-- partyType -->
                        <div class="col-sm-auto mb-2">
                            <div>
                                <div class="form-check form-check-inline">
                                    <input
                                        class="form-check-input"
                                        type="radio"
                                        v-model="item.partyType"
                                        :value="PartyTypes.Person"
                                        :disabled="readonly"
                                        id="partyTypePerson"
                                    />
                                    <label class="form-check-label" for="partyTypePerson">{{ $t("party.person") }}</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input
                                        class="form-check-input"
                                        type="radio"
                                        v-model="item.partyType"
                                        :value="PartyTypes.Organization"
                                        :disabled="readonly"
                                        id="partyTypeOrganization"
                                    />
                                    <label class="form-check-label" for="partyTypeOrganization">{{ $t("party.organization") }}</label>
                                </div>
                            </div>
                            <FormLabel :label="$t('party.partyType')" />
                        </div>
                    </div>

                    <!-- Person fields -->
                    <template v-if="item.partyType === PartyTypes.Person">
                        <div class="row">
                            <div class="col-md mb-2">
                                <input v-model="item.salutation" maxlength="16" :readonly="readonly" class="form-control" />
                                <FormLabel :label="$t('party.salutation')" />
                            </div>
                            <div class="col-md mb-2">
                                <input v-model="item.givenName" maxlength="64" :readonly="readonly" class="form-control" />
                                <FormLabel :label="$t('party.givenName')" />
                            </div>
                            <div class="col-md mb-2">
                                <input v-model="item.middleName" maxlength="64" :readonly="readonly" class="form-control" />
                                <FormLabel :label="$t('party.middleName')" />
                            </div>
                            <div class="col-md mb-2">
                                <input v-model="item.familyName" maxlength="64" :readonly="readonly" class="form-control" />
                                <FormLabel :label="$t('party.familyName')" />
                            </div>
                        </div>
                    </template>

                    <!-- Organization fields -->
                    <template v-if="item.partyType === PartyTypes.Organization">
                        <div class="row">
                            <!-- name -->
                            <div class="col mb-2">
                                <div class="input-group">
                                    <div class="input-group-text">
                                        <Icon name="title" />
                                    </div>
                                    <input v-model="item.name" maxlength="128" :readonly="readonly" class="form-control" />
                                </div>
                                <FormLabel :label="$t('party.name')" />
                            </div>
                            <!-- code -->
                            <div class="col-sm col-md-2 mb-2">
                                <div class="input-group">
                                    <div class="input-group-text">
                                        <Icon name="code" />
                                    </div>
                                    <input v-model="item.code" maxlength="32" :readonly="readonly" class="form-control" />
                                </div>
                                <FormLabel :label="$t('code')" />
                            </div>
                            <!-- legalEntity -->
                            <div class="col-sm col-md-2 mb-2">
                                <input v-model="item.legalEntity" maxlength="64" :readonly="readonly" class="form-control" />
                                <FormLabel :label="$t('party.legalEntity')" />
                            </div>
                        </div>
                    </template>
                </FormSection>

                <ContactDataOverview v-model="item.contactData" :party="item" />

                <template v-for="relation in item.parentRelationships?.filter((x) => !x._deleted)" :key="relation.id">
                    <div v-if="relation.contactData?.length" class="" style="opacity: 0.4">
                        <strong>{{ relation.parent?.title }}</strong>
                        <div v-for="item in relation.contactData" class="mb-2" :key="item.id">
                            <div class="input-group">
                                <ActionButton :item="item" class="btn btn-outline-info" />
                                <input v-model="item.value" class="form-control" />
                                <span class="input-group-text" v-if="item.title != null">{{ item.title }}</span>
                            </div>
                        </div>
                    </div>
                </template>

                <AddressesOverview v-model="item.addresses" :party="item" />

                <FormSection :title="$t('description')">
                    <div class="row">
                        <div class="col mb-2">
                            <DescriptionInput v-model="item.description" :label="$t('description')" :readonly="readonly" />
                        </div>
                    </div>
                </FormSection>
            </template>

            <template #relations>
                <RelationshipsOverview v-model="item" />
            </template>

            <template #tree>
                <TreeOverview :item="item" />
            </template>

            <template #products>
                <ProductsOverview :party="item" />
            </template>
        </TabContainer>

        <Debug
            :modelValue="{
                item: {
                    ...item,
                    contactData: item.contactData?.map(({ id, dataType, value }) => `#${id} ${dataType}: ${value}`),
                    addresses: item.addresses?.map(
                        ({ id, street, houseNumber, city, countryCode }) =>
                            `#${id} ${street ?? ''} ${houseNumber ?? ''}, ${city ?? ''} (${countryCode})`
                    ),
                    childRelationships: item.childRelationships?.map(
                        ({ id, child, relationshipType }) => `#${id} ${child?.title} (${relationshipType?.title})`
                    ),
                    parentRelationships: item.parentRelationships?.map(({ id, parent, relationshipType, contactData }) => ({
                        parent: `#${id} ${parent?.title} (${relationshipType?.title})`,
                        contactData: contactData?.map(({ id, dataType, value }) => `#${id} ${dataType}: ${value}`),
                    })),
                },
            }"
        />
    </form>
</template>

<script setup lang="ts">
import { computed, watch } from "vue"
import type { RouteRecordRaw } from "vue-router"
import { useLang } from "regira_modules/vue/lang"
import { Feedback, TabContainer, Tab } from "regira_modules/vue/ui"
import { FormButtonsRow } from "@/components/input"
import { useForm, type FormEmits, formDefaults } from "regira_modules/vue/entities"
import { config as productConfig } from "@/entities/products"
import { config as partyRelationshipTypeConfig } from "@/entities/party-relationship-types"
import config from "../config/config"
import Entity from "../data/Entity"
import PartyTypes from "../data/PartyTypes"
import useEntityStore from "../data/store"
import ActionButton from "../party-contact-data/ActionButton.vue"
import { Overview as AddressesOverview } from "../party-addresses"
import { Overview as ContactDataOverview } from "../party-contact-data"
import { Overview as ProductsOverview } from "../party-products"
import { Overview as RelationshipsOverview } from "../party-relations"
import { Overview as TreeOverview } from "../tree"

interface Emits extends /* @vue-ignore */ FormEmits<Entity> {}
const emit = defineEmits<Emits>()
const props = withDefaults(
    defineProps<{
        modelValue: Entity
        readonly?: boolean
        overviewUrl?: string | RouteRecordRaw
        isPopup?: boolean
        initialTab?: string
    }>(),
    { ...formDefaults }
)

const { service: entityService } = useEntityStore()

const { item, feedback, handleCancel, handleSubmit, handleRemove, handleRestore } = useForm<Entity>({
    entityService,
    props,
    emit,
})

watch(
    () => item.value.partyType,
    () => {
        if (item.value.partyType === PartyTypes.Person) {
            item.value = entityService.toEntity({
                ...item.value,
                familyName: item.value.name,
            })
        }
        if (item.value.partyType === PartyTypes.Organization) {
            item.value = entityService.toEntity({
                ...item.value,
                name: item.value.familyName,
            })
        }
    }
)

// Tabs
const { translate } = useLang()
const tabs = computed(() =>
    [
        Tab.create("form", { icon: "form", title: translate("form"), isDefault: true }),
        Tab.create("relations", { icon: partyRelationshipTypeConfig.key, title: translate("party.relations") }),
        Tab.create("tree", { icon: "tree", title: translate("tree") }),
        Tab.create("products", { icon: productConfig.key, title: translate("products") }),
    ].filter((tab) => tab)
)
</script>
