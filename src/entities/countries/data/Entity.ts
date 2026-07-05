import { EntityBase } from "regira_modules/vue/entities"

export class Country extends EntityBase {
    id?: string
    title?: string
    code?: string
    isDefault: boolean

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = Country

export default Country
