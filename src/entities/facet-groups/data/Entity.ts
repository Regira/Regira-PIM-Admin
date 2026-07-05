import { EntityBase } from "regira_modules/vue/entities"
import type FacetChildGroup from "../facet-group-links/Entity"
import type FacetParentGroup from "../facet-group-links/Entity"

export class FacetGroup extends EntityBase {
    id: number = 0
    code?: string
    title: string
    description?: string

    created?: Date
    lastModified?: Date

    parentFacets?: Array<FacetChildGroup>
    childFacets?: Array<FacetParentGroup>

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = FacetGroup

export default FacetGroup
