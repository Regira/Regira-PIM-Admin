import type { IConfig } from "regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/products"

const config: IConfig = {
    id: Entity.name,
    key: "Product",
    requires: [],
    isComplex: true,

    routePrefix: "products",
    baseQueryParams: {
        includes: ["Facets", "Components"],
    },
    initialQuery: { isRoot: true },

    overviewTitle: "products",
    detailsTitle: "product",
    description: "product.description",
    icon: "bi bi-joystick",

    defaultPageSize: 10,

    api,
    detailsUrl: api,
    listUrl: api,
    searchUrl: api + "/search",
    saveUrl: api,
    deleteUrl: api,
}

export default config
