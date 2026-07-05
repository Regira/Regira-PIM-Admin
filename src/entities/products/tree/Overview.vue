<template>
    <FormSection @collapse="$emit('collapse')">
        <template #title>
            <div class="row g-0">
                <div class="col">
                    <h3 class="pt-2 ps-2">Hierarchy</h3>
                </div>
                <div class="col-auto py-1">
                    <div class="form-check my-0 float-end">
                        <label class="btn btn-info mx-1" :class="{ 'opacity-50': includeFacets }" title="show facets">
                            <input type="checkbox" v-model="includeFacets" class="btn-check" />
                            <Icon :name="facetConfig.key" class="me-1" />
                            <span class="d-none d-lg-inline d-xl-none">show facets</span>
                        </label>
                        <label class="btn btn-info mx-1" :class="{ 'opacity-50': includeSuppliers }" title="show suppliers">
                            <input type="checkbox" v-model="includeSuppliers" :true-value="true" class="btn-check" />
                            <Icon :name="partyConfig.key" class="me-1" />
                            <span class="d-none d-lg-inline d-xl-none">show suppliers</span>
                        </label>
                        <IconButton v-if="!areAllExanded" icon="expand" class="btn-info mx-1" @click="expandAll" />
                        <IconButton v-else icon="collapse" class="btn-info mx-1" @click="collapseAll" />
                    </div>
                </div>
            </div>
        </template>
        <div v-if="skipTree" class="italic-muted my-2">{{ $t("product.treeDisabled") }}</div>
        <LoadingContainer :is-loading="isLoading">
            <template v-if="tree != null">
                <div v-if="hasNoItems" class="italic-muted my-2">No items</div>
                <template v-else>
                    <div class="float-end">
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="checkbox" v-model="reverseTree" :true-value="true" class="form-check-input" />
                                {{ $t("tree.invert") }}
                            </label>
                        </div>
                    </div>
                    <div v-if="reverseTree" class="text-muted fst-italic">({{ $t("tree.inverted") }})</div>
                    <TreeView
                        :nodes="tree.roots"
                        :selected="selectedNodes!"
                        :facets="productFacets"
                        :suppliers="productSuppliers"
                        @add-child="linkItemAsChild"
                        @move="handleMove"
                        @expand-node="expandNode"
                        @collapse-node="collapseNode"
                        @toggle-node="toggleNode"
                        class="tree"
                    />
                </template>
            </template>
        </LoadingContainer>
        <Debug
            title="tree"
            :modelValue="{
                roots: tree?.getRoots().map((r) => r.value.item?.title),
                nodes: tree
                    ?.getNodes()
                    .map((n) => ''.padStart(n.level * 4, '.') + `${n.value.item?.title} (#${n.value.id}) ${n.value.isExpanded ? '+' : '-'}`),
            }"
        />
    </FormSection>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue"
import { distinctBy } from "regira_modules/utilities/array-utility"
import { get } from "regira_modules/vue/ioc"
import { TreeList, TreeNode } from "regira_modules/treelist"
import TreeItem from "./TreeItem"
import TreeView from "./TreeView.vue"
import ProductAssembly from "../product-assemblies/Entity"
import { Entity, type EntityService, useEntityStore } from "../"
import { Entity as Facet, config as facetConfig, useEntityStore as useFacetStore } from "../../facets"
import { Entity as Party, config as partyConfig, useEntityStore as usePartyStore } from "../../parties"
import { toTree } from "./functions"
import { FamilyItem } from "."

const props = defineProps<{
    item: Entity
}>()

const includeFacets = ref(false)
const productFacets = ref<Record<number, Array<Facet>>>()

const includeSuppliers = ref(false)
const productSuppliers = ref<Record<number, Array<Party>>>()

const isLoading = ref(false)
const { service } = useEntityStore()

const hasNoItems = ref<boolean>()
const skipTree = ref<boolean>(false)

const reverseTree = ref<boolean>()
const skinnyTree = ref<TreeList<TreeItem>>()
const tree = ref<TreeList<TreeItem>>()
const entityService = get<EntityService>(Entity.name)!
const family = ref<Array<FamilyItem>>()
const selectedNodes = computed(() => tree.value?.filter((n) => n.value?.id == props.item?.id))

async function handleMove({ child, parent }: { child: TreeNode<TreeItem>; parent: TreeNode<TreeItem> }) {
    if (child.value?.item && parent.value?.item) {
        // if (reverseTree.value) {
        //     const temp = child
        //     child = parent
        //     parent = temp
        // }

        isLoading.value = true

        const details = (await service.details(child.value.id))!
        if (child.parent != null) {
            // remove previous parent
            details.assemblies = details.assemblies?.filter((x) => x.assemblyId != child.parent?.value.id)
        }
        if (!details.assemblies?.some((p) => p.assemblyId == props.item.id)) {
            details.assemblies?.push(ProductAssembly.create({ componentId: child.value.id, assemblyId: parent.value.id }))
        }
        const { saved } = await service.save(details)

        child.value.item = saved

        tree.value!.move(child, parent)

        isLoading.value = false
    }
    if (parent.value) {
        expandNode(parent)
    }
}
async function linkItemAsChild(child?: Entity, parent?: Entity) {
    if (!child?.id) {
        return
    }
    parent ??= props.item

    // if (reverseTree.value) {
    //     const temp = child
    //     child = parent
    //     parent = temp
    // }

    isLoading.value = true
    const details = (await service.details(child.id))!
    isLoading.value = false
    if (!details.assemblies?.some((p) => p.assemblyId == parent!.id)) {
        isLoading.value = true
        details.assemblies!.push(ProductAssembly.create({ assembly: parent, assemblyId: parent.id }))
        await service.save(details)
        isLoading.value = false
    }

    await load()

    if (parent != null) {
        const parentNodes = tree.value?.getNodes().filter((n) => n.value.id == parent.id)
        parentNodes?.forEach((node) => expandNode(node))
    }
}

const areAllExanded = computed(() => tree.value?.getOffspring(tree.value.roots).every((n) => n.value.isExpanded))
function expandAll() {
    tree.value?.getOffspring(tree.value.roots).forEach((n) => (n.value.isExpanded = true))
}
function collapseAll() {
    tree.value?.getOffspring(tree.value.roots).forEach((n) => (n.value.isExpanded = false))
}
function expandDefault() {
    tree.value?.forEach(
        (r) =>
            (r.value.isExpanded =
                (!selectedNodes.value!.some((n) => n.value.isExpanded) && selectedNodes.value!.some((n) => n.value?.id == r.value?.id)) ||
                selectedNodes.value!.some((n) => n.getAncestors().some((o) => o.value?.id == r.value?.id)))
    )
}

function expandNode(node: TreeNode<TreeItem>) {
    node.value.isExpanded = true
}
function collapseNode(node: TreeNode<TreeItem>) {
    node.value.isExpanded = false
}
function toggleNode(node: TreeNode<TreeItem>) {
    node.value.isExpanded = !node.value.isExpanded
}

async function load() {
    // if there are no components, there is not much use for a tree
    // moreover: there could be too many ancestors to display
    skipTree.value = props.item.components?.length == 0
    if (skipTree.value) {
        return
    }
    isLoading.value = true
    const familyItems = await entityService.getFamily([props.item.id])
    family.value = distinctBy(familyItems, (x: FamilyItem) => `${x.childId}_${x.parentId || 0}`)
    isLoading.value = false
}

watchEffect(load)
watchEffect(() => {
    if (family.value) {
        if (reverseTree.value == null) {
            reverseTree.value =
                family.value.length > 1 &&
                family.value!.filter((x) => x.parentId == props.item.id).length < family.value!.filter((x) => x.childId == props.item.id).length
        }

        skinnyTree.value = toTree(props.item, family.value, reverseTree.value)
    }
})
watchEffect(async () => {
    if (skinnyTree.value) {
        isLoading.value = true

        const familyIds = skinnyTree.value.getValues().map((x) => x.id)

        const ids = [...new Set([...familyIds])]
        if (ids.length > 0) {
            const items = await service.list({ ids, pageSize: 0 })
            skinnyTree.value.forEach((node) => {
                node.value.item = items.find((x) => x.id == node.value.id)
            })
        } else {
            hasNoItems.value = true
        }
        tree.value = skinnyTree.value
        expandDefault()
        isLoading.value = false
    }
})
// Facets
watchEffect(async () => {
    if (includeFacets.value) {
        isLoading.value = true
        const { service: facetService } = useFacetStore()
        const productIds = [...new Set([...tree.value!.map((x) => x.value.id)])]
        const productsWithFacets = await service.list({ ids: productIds, includes: ["Facets"], pageSize: 0 })
        const result = productsWithFacets.map((p) => [p.id, p.facets?.map((e) => facetService.toEntity(e.facet!)) || []])
        productFacets.value = Object.fromEntries(result)
        isLoading.value = false
    } else {
        productFacets.value = undefined
    }
})
// Suppliers
watchEffect(async () => {
    if (includeSuppliers.value) {
        isLoading.value = true
        const { service: partyService } = usePartyStore()
        const productIds = [...new Set([...tree.value!.map((x) => x.value.id)])]
        const productsWithSuppliers = await service.list({ ids: productIds, includes: ["Suppliers"], pageSize: 0 })
        const result = productsWithSuppliers.map((p) => [p.id, p.suppliers?.map((e) => partyService.toEntity(e.supplier!)) || []])
        productSuppliers.value = Object.fromEntries(result)
        isLoading.value = false
    } else {
        productSuppliers.value = undefined
    }
})
</script>
