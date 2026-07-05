import { SearchObjectBase } from "regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {
    title?: string

    assemblyId?: number | Array<number>
    componentId?: number | Array<number>
    allComponentId?: number | Array<number>
    excludeComponentId?: number | Array<number>

    facetGroupId?: number | Array<number>
    excludeFacetGroupId?: number | Array<number>

    facetId?: number | Array<number>
    allFacetId?: number | Array<number>
    excludeFacetId?: number | Array<number>

    unitTypeId?: number
    supplierId?: number | Array<number>

    isRoot?: boolean
    isComponent?: boolean
    isAssembly?: boolean

    minCreated?: Date
    maxCreated?: Date
    minLastModified?: Date
    maxLastModified?: Date
}

export default EntitySearchObject
