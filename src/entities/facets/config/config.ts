import type { IConfig } from "regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/facets"

const config: IConfig = {
    id: Entity.name,
    key: "Facet",
    requires: [],
    isComplex: true,

    routePrefix: "facets",
    baseQueryParams: {
        includes: ["FacetGroups"],
    },
    initialQuery: {
        isRoot: true,
    },

    overviewTitle: "facets",
    detailsTitle: "facet",
    description: "facet.description",
    icon: "bi bi-tags",

    defaultPageSize: 10,

    api,
    detailsUrl: api,
    listUrl: api,
    get searchUrl() {
        return this.isComplex ? api + "/search" : api
    },
    saveUrl: api,
    deleteUrl: api,
}

export default config
