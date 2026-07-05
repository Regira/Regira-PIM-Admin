import { EntityBase } from "regira_modules/vue/entities"
import type FacetGroup from "@/entities/facets/data/Entity"
import type Facet from "../data/Entity"

export class FacetFacetGroup extends EntityBase {
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
        return this.facetGroup?.title
    }

    static create(values?: object): FacetFacetGroup {
        return Object.assign(new FacetFacetGroup(), values || {})
    }
}

export const Entity = FacetFacetGroup

export default FacetFacetGroup
