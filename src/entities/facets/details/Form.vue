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
                        <div class="col mb-2">
                            <div class="input-group">
                                <div class="input-group-text">
                                    <Icon name="code" />
                                </div>
                                <input v-model="item.code" maxlength="32" :readonly="readonly" class="form-control" />
                            </div>
                            <FormLabel :label="$t('code')" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col mb-2">
                            <div class="input-group">
                                <div class="input-group-text">
                                    <Icon name="title" />
                                </div>
                                <input v-model="item.title" maxlength="64" :readonly="readonly" class="form-control" />
                            </div>
                            <FormLabel :label="$t('name')" />
                        </div>
                    </div>
                </FormSection>

                <FacetGroupsOverview v-model="item" :facet="item" />

                <RelatedFacetsOverview v-model="item" />

                <FormSection :title="$t('description')">
                    <div class="row">
                        <div class="col mb-2">
                            <DescriptionInput v-model="item.description" :label="$t('description')" :readonly="readonly" />
                        </div>
                    </div>
                </FormSection>
            </template>

            <template #products>
                <ProductsOverview :facet="item" />
            </template>

            <template #tree>
                <TreeOverview :item="item" />
            </template>
        </TabContainer>

        <Debug
            :modelValue="{
                item,
            }"
        />
    </form>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { RouteRecordRaw } from "vue-router"
import { useLang } from "regira_modules/vue/lang"
import { Feedback, TabContainer, Tab } from "regira_modules/vue/ui"
import { useForm, type FormEmits, formDefaults } from "regira_modules/vue/entities"
import { FormButtonsRow } from "@/components/input"
import { config as productConfig } from "@/entities/products"
import { Overview as RelatedFacetsOverview } from "../facet-related-facets"
import { Overview as FacetGroupsOverview } from "../facet-group-links"
import { Overview as ProductsOverview } from "../facet-products"
import TreeOverview from "../tree/Overview.vue"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"

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

// Tabs
const { translate } = useLang()
const tabs = computed(() =>
    [
        Tab.create("form", { icon: "form", title: translate("form"), isDefault: true }),
        Tab.create("tree", { icon: "tree", title: translate("tree") }),
        Tab.create("products", { icon: productConfig.key, title: translate("products") }),
    ].filter((tab) => tab)
)
</script>
