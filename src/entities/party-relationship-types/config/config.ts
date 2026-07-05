import type { IConfig } from "regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/relationship-types"

const config: IConfig = {
    id: Entity.name,
    key: "PartyRelationshipType",
    requires: [],
    isComplex: false,

    routePrefix: "party-relationship-types",
    baseQueryParams: {
        includes: [],
    },
    initialQuery: {},

    overviewTitle: "partyRelationshipTypes",
    detailsTitle: "partyRelationshipType",
    description: "partyRelationshipType.description",
    icon: "bi bi-diagram-2",

    defaultPageSize: 0,

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
