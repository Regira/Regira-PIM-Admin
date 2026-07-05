import type { IConfig } from "regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/countries"

const config: IConfig = {
    id: Entity.name,
    key: "Country",
    requires: [],

    routePrefix: "country",
    baseQueryParams: {
        //include: [],
    },
    nav: [],

    overviewTitle: "countries",
    detailsTitle: "country",
    icon: "bi bi-globe-americas",

    defaultPageSize: 10,

    api,
    detailsUrl: api,
    listUrl: api,
    searchUrl: api,
    saveUrl: api,
    deleteUrl: api,
}

export default config
