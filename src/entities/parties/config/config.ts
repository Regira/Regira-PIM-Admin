import type { IConfig } from "regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/parties"

const config: IConfig = {
    id: Entity.name,
    key: "Party",
    requires: [],
    isComplex: true,

    routePrefix: "parties",
    baseQueryParams: {
        includes: ["Addresses", "ContactData", "Relationships"],
    },
    initialQuery: {},

    overviewTitle: "parties",
    detailsTitle: "party",
    description: "party.description",
    icon: "bi bi-person-vcard",

    defaultPageSize: 10,

    api,
    detailsUrl: api,
    listUrl: api,
    searchUrl: api + "/search",
    saveUrl: api,
    deleteUrl: api,
}

export default config
