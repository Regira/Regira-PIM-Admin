import { EntityBase } from "regira_modules/vue/entities"
import type Facet from "@/entities/facets/data/Entity"

export class ProductFacet extends EntityBase {
    id: number = 0
    productId: number
    facetId: number

    facet?: Facet

    _deleted: boolean = false

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.facet?.title
    }

    static create(values?: object): ProductFacet {
        return Object.assign(new ProductFacet(), values || {})
    }
}

export const Entity = ProductFacet

export default ProductFacet
