import type { IConfig } from "regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/unit-types"

const config: IConfig = {
    id: Entity.name,
    key: "UnitType",
    requires: [],
    isComplex: false,

    routePrefix: "unit-types",
    baseQueryParams: {
        includes: [],
    },
    initialQuery: {},

    overviewTitle: "unitTypes",
    detailsTitle: "unitType",
    description: "unitType.description",
    icon: "bi bi-tools",

    defaultPageSize: 0,

    api,
    detailsUrl: api,
    listUrl: api,
    searchUrl: api + "/search", // counted search: rows plus the total the overview pages with
    saveUrl: api,
    deleteUrl: api,
}

export default config
