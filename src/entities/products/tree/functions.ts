import { TreeList, type TreeNode } from "regira_modules/treelist"
import type Entity from "../data/Entity"
import type FamilyItem from "./FamilyItem"
import { TreeItem, ChildItem } from "./TreeItem"

export function toTreeItems(self: Entity | Array<Entity>, family: Array<FamilyItem>): Array<TreeItem> {
    const selfIds = (Array.isArray(self) ? self : [self]).map((x) => x.id)
    const ids = [...new Set([...selfIds, ...family.flatMap(({ parentId, childId }) => [parentId, childId])])].filter((x) => x != null)
    return ids.map((id) =>
        TreeItem.create({
            id,
            children: family.filter((x) => x.parentId === id).map(({ childId: id }) => ChildItem.create({ id })),
        })
    )
}
export function toReverseTreeItems(self: Entity | Array<Entity>, family: Array<FamilyItem>): Array<TreeItem> {
    const selfIds = (Array.isArray(self) ? self : [self]).map((x) => x.id)
    const ids = [...new Set([...selfIds, ...family.flatMap(({ parentId, childId }) => [parentId, childId])])].filter((x) => x != null)
    return ids.map((id) =>
        TreeItem.create({
            id,
            children: family.filter((x) => x.childId === id).map(({ parentId: id }) => ChildItem.create({ id })),
        })
    )
}

export function toTree(self: Entity | Array<Entity>, family: Array<FamilyItem>, reverse = false): TreeList<TreeItem> {
    const treeItems = reverse ? toReverseTreeItems(self, family) : toTreeItems(self, family)
    const roots = treeItems.filter((x) => (reverse ? !family.some((f) => f.parentId == x.id) : !family.some((f) => f.childId == x.id)))
    const tree = new TreeList<TreeItem>()
    function add(item: TreeItem, parentNode?: TreeNode) {
        const node = tree.addValue(item, parentNode)
        if (item.children?.length) {
            item.children.forEach((child) => {
                const childItem = ChildItem.create({ ...child, ...treeItems.find((x) => child.id === x.id)! })
                add(childItem, node)
            })
        }
    }
    roots.forEach((item) => add(item))
    return tree
}
