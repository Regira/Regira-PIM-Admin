import { EntityBase } from "regira_modules/vue/entities"
import type FacetParent from "../facet-related-facets/FacetParent"
import type FacetChild from "../facet-related-facets/FacetChild"
import type FacetFacetGroup from "../facet-group-links/FacetFacetGroup"

export class Facet extends EntityBase {
    id: number = 0
    code?: string
    title: string
    description?: string

    created?: Date
    lastModified?: Date

    parentEntities?: Array<FacetParent>
    childEntities?: Array<FacetChild>

    facetParentGroups?: Array<FacetFacetGroup>
    facetChildGroups?: Array<FacetFacetGroup>

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = Facet

export default Facet
