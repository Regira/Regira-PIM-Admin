import { EntityBase } from "regira_modules/vue/entities"
import type Facet from "@/entities/facets/data/Entity"
import type FacetGroup from "../data/Entity"

export class FacetGroupFacet extends EntityBase {
    id: number = 0
    facetGroupId: number
    facetId: number

    facetGroup?: FacetGroup
    facet?: Facet

    _deleted: boolean = false

    override get $id(): string | number {
        return this.id || "new"
    }

    override get $title(): string | undefined {
        return this.facet?.title
    }

    static create(values?: object): FacetGroupFacet {
        return Object.assign(new FacetGroupFacet(), values || {})
    }
}

export const Entity = FacetGroupFacet

export default FacetGroupFacet
