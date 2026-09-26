import { EntityBase } from "regira_modules/vue/entities"
import { type Entity as UnitType } from "@/entities/unit-types"
import type ProductComponent from "../product-components/Entity"
import type ProductFacet from "../product-facets/Entity"
import type ProductSupplier from "../product-suppliers/Entity"

export class Product extends EntityBase {
    id: number = 0
    title: string
    description?: string

    unitTypeId?: number
    defaultQuantity?: number

    created?: Date
    lastModified?: Date
    isArchived: boolean = false
    // sent back on save: the API answers 409 when someone else saved in between
    concurrencyToken?: string

    unitType?: UnitType
    assemblies?: ProductComponent[]
    components?: ProductComponent[]
    facets?: ProductFacet[]
    suppliers?: ProductSupplier[]

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = Product

export default Product
