//import type { IEntity } from "regira_modules/vue/entities"
import type Entity from "../data/Entity"

export class FamilyItem /* implements IEntity */ {
    parentId: number
    childId: number
    level: number
    rootId: number

    parent?: Entity
    child?: Entity
    root?: Entity

    get $id(): string {
        return `${this.parentId}:${this.childId}`
    }
    get $title(): string {
        return `${this.child?.title} is child of ${this.parent?.title}`
    }

    toString(): string {
        return `${this.level}:${this.parentId || ""}:${this.childId || ""}`
    }
    static create(values: object): FamilyItem {
        return Object.assign(new FamilyItem(), values)
    }
}

export default FamilyItem
