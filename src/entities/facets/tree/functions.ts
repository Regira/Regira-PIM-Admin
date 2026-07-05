import { TreeList, type TreeNode } from "regira_modules/treelist"
import type FamilyItem from "./FamilyItem"
import { TreeItem, ChildItem } from "./TreeItem"

export function toTreeItems(selfId: number, family: Array<FamilyItem>): Array<TreeItem> {
    const ids = [...new Set([selfId, ...family.flatMap(({ parentId, childId }) => [parentId, childId])])].filter((x) => x != null)
    return ids.map((id) => {
        const asChild = family.find((x) => x.childId === id)
        const asParent = family.find((x) => x.parentId === id)
        const type = asChild?.childType || asParent?.parentType || ""
        return TreeItem.create({
            id,
            type,
            children: family.filter((x) => x.parentId === id).map(({ childId: id, childType: type }) => ChildItem.create({ id, type })),
        })
    })
}

export function toReverseTreeItems(selfId: number, family: Array<FamilyItem>): Array<TreeItem> {
    const ids = [...new Set([selfId, ...family.flatMap(({ parentId, childId }) => [parentId, childId])])].filter((x) => x != null)
    return ids.map((id) => {
        const asChild = family.find((x) => x.childId === id)
        const asParent = family.find((x) => x.parentId === id)
        const type = asChild?.childType || asParent?.parentType || ""
        return TreeItem.create({
            id,
            type,
            children: family.filter((x) => x.childId === id).map(({ parentId: id, parentType: type }) => ChildItem.create({ id, type })),
        })
    })
}

export function toTree(selfId: number, family: Array<FamilyItem>, reverse = false): TreeList<TreeItem> {
    const treeItems = reverse ? toReverseTreeItems(selfId, family) : toTreeItems(selfId, family)
    const roots = treeItems.filter((x) => (reverse ? !family.some((f) => f.parentId == x.id) : !family.some((f) => f.childId == x.id)))
    const tree = new TreeList<TreeItem>()
    function add(item: TreeItem, parentNode?: TreeNode<TreeItem>) {
        const node = tree.addValue(item, parentNode)
        if (item.children?.length) {
            item.children.forEach((child) => {
                const found = treeItems.find((x) => child.id === x.id)
                if (found) {
                    const childItem = ChildItem.create({ ...child, ...found })
                    add(childItem, node)
                }
            })
        }
    }
    roots.forEach((item) => add(item))
    return tree
}
