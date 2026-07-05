import type { App } from "vue"
import type { AxiosInstance } from "axios"
import type { IServiceProvider } from "regira_modules/vue/ioc"
import type { IIconProvider } from "regira_modules/vue/ui/icons"
import config from "./config/config"
import { Entity } from "./data/Entity"
import { EntityService } from "./data/EntityService"

export function addServices(serviceProvider: IServiceProvider) {
    serviceProvider.add(Entity.name, (sp) => new EntityService(sp.get<AxiosInstance>("axios")!, config))
}

export function addIcons(icons: IIconProvider) {
    icons.add(config.key, config.icon!)
}

export default {
    install(app: App<Element>, { routes }: { routes?: Array<any> }) {
        addServices(app.config.globalProperties.$services)
        addIcons(app.config.globalProperties.$icons)
        app.config.globalProperties.$configs[Entity.name] = config

        console.debug("install", Entity.name)
    },
}
