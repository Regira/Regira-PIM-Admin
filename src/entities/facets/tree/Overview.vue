<template>
    <FormSection @collapse="$emit('collapse')">
        <template #title>
            <div class="row g-0">
                <div class="col">
                    <h3 class="pt-2 ps-2">Hierarchy</h3>
                </div>
                <div class="col-auto py-1">
                    <div class="form-check my-0 float-end">
                        <IconButton v-if="!areAllExpanded" icon="expand" class="btn-info mx-1" @click="expandAll" />
                        <IconButton v-else icon="collapse" class="btn-info mx-1" @click="collapseAll" />
                    </div>
                </div>
            </div>
        </template>
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
            :modelValue="{
                treeRoots: tree?.getRoots().map((r) => (r.value.item as any)?.title),
            }"
        />
    </FormSection>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue"
import { distinctBy } from "regira_modules/utilities/array-utility"
import { get } from "regira_modules/vue/ioc"
import { TreeList, TreeNode } from "regira_modules/treelist"
import { config, Entity, type EntityService, useEntityStore } from "../../facets"
import { config as facetGroupConfig, useEntityStore as useFacetGroupStore } from "../../facet-groups"
import { toTree } from "./functions"
import { FamilyItem } from "."
import TreeItem from "./TreeItem"
import TreeView from "./TreeView.vue"
import { FacetParent } from "../facet-related-facets"

const props = defineProps<{
    item: Entity
}>()

const isLoading = ref(false)
const hasNoItems = ref<boolean>()
const { service } = useEntityStore()

const reverseTree = ref<boolean>()
const skinnyTree = ref<TreeList<TreeItem>>()
const tree = ref<TreeList<TreeItem>>()
const entityService = get<EntityService>(Entity.name)!
const family = ref<Array<FamilyItem>>()
const selectedNodes = computed(() => tree.value?.filter((n) => n.value?.id == props.item?.id && n.value?.type == config.key))

const areAllExpanded = computed(() => tree.value?.getOffspring(tree.value.roots).every((n) => n.value.isExpanded))
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
            details.parentEntities = details.parentEntities?.filter((x) => x.parentId != child.parent?.value.id)
        }
        if (!details.parentEntities?.some((p) => p.parentId == props.item?.id)) {
            details.parentEntities?.push(FacetParent.create({ childId: child.value.id, parentId: parent.value.id }))
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
    if (!details.parentEntities?.some((p) => p.parentId == parent!.id)) {
        isLoading.value = true
        details.parentEntities!.push(FacetParent.create({ parent: parent, parentId: parent.id }))
        await service.save(details)
        isLoading.value = false
    }

    await load()

    if (parent != null) {
        const parentNodes = tree.value?.getNodes().filter((n) => n.value.id == parent.id)
        parentNodes?.forEach((node) => expandNode(node))
    }
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
    isLoading.value = true
    // also load siblings
    const parentIds = props.item?.parentEntities?.map((p) => p.parentId) ?? []
    const groupIds = props.item?.facetParentGroups?.map((g) => g.facetGroupId) ?? []
    const familyItems = await entityService.getFamily([props.item.id, ...parentIds], groupIds)
    family.value = distinctBy(familyItems, (x: FamilyItem) => `${x.childId}_${x.parentId || 0}`)
    isLoading.value = false
}

watchEffect(load)
watchEffect(() => {
    if (family.value) {
        if (reverseTree.value == null) {
            const tempTree = toTree(props.item.id, family.value, false)
            const self = tempTree.getNodes().filter((n) => n.value?.id == props.item.id)
            const offspring = tempTree.getOffspring(self)
            const ancestors = tempTree.getAncestors(self)
            reverseTree.value = ancestors.length > 1 && offspring.length > 1 && ancestors.length > offspring.length
        }

        skinnyTree.value = toTree(props.item.id, family.value, reverseTree.value)
    }
})
watchEffect(async () => {
    if (skinnyTree.value) {
        const facetIds = skinnyTree.value
            .getValues()
            .filter((x) => x.type === config.key)
            .map((x) => x.id)
        const facetGroupIds = skinnyTree.value
            .getValues()
            .filter((x) => x.type === facetGroupConfig.key)
            .map((x) => x.id)

        if (facetIds.length > 0 || facetGroupIds.length > 0) {
            isLoading.value = true
            const { service: facetService } = useEntityStore()
            const { service: facetGroupService } = useFacetGroupStore()

            const [facets, facetGroups] = await Promise.all([
                facetIds.length > 0 ? facetService.list({ ids: facetIds, pageSize: 0 }) : Promise.resolve([]),
                facetGroupIds.length > 0 ? facetGroupService.list({ ids: facetGroupIds, pageSize: 0 }) : Promise.resolve([]),
            ])

            skinnyTree.value.forEach((node) => {
                if (node.value.type === config.key) {
                    node.value.item = facets.find((x) => x.id == node.value.id)
                } else {
                    node.value.item = facetGroups.find((x) => x.id == node.value.id)
                }
            })
            tree.value = skinnyTree.value
            expandDefault()
            isLoading.value = false
        } else {
            hasNoItems.value = true
            tree.value = skinnyTree.value
        }
    }
})
</script>
