import { EntityBase } from "regira_modules/vue/entities"

export class UnitType extends EntityBase {
    id: number = 0
    code?: string
    title: string
    description?: string

    created?: Date
    lastModified?: Date

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = UnitType

export default UnitType
