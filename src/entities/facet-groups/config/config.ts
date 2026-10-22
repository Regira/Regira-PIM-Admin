import type { IConfig } from "regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/facet-groups"

const config: IConfig = {
    id: Entity.name,
    key: "FacetGroup",
    requires: [],
    isComplex: true,

    routePrefix: "facet-groups",
    baseQueryParams: {
        includes: [],
    },
    initialQuery: {
        isRoot: true,
    },

    overviewTitle: "facetGroups",
    detailsTitle: "facetGroup",
    description: "facetGroup.description",
    icon: "bi bi-bookmarks",

    defaultPageSize: 10,

    api,
    detailsUrl: api,
    listUrl: api,
    searchUrl: api + "/search", // counted search: rows plus the total the overview pages with
    saveUrl: api,
    deleteUrl: api,
}

export default config
