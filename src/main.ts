import { createApp } from "vue"
import { createPinia } from "pinia"
import type { RouteRecordRaw } from "vue-router"
import { initAxios } from "regira_modules/vue/http"
import { plugin as servicesPlugin, configureGlobals, type IServiceProvider } from "regira_modules/vue/ioc"
import { AppStatus, plugin as appPlugin, whenAppReady } from "regira_modules/vue/app"
import { plugin as langPlugin, useLang } from "regira_modules/vue/lang"
import {
    iconPlugin,
    loadingPlugin,
    screenPlugin,
    feedbackPlugin,
    pagingPlugin,
    modalPlugin,
    Anchor,
    FormSection,
    FormLabel,
    DateInput,
    NullableCheckBox,
    NullableLabel,
    DescriptionInput,
} from "regira_modules/vue/ui"
import { focus, grow, clickOutside } from "regira_modules/vue/directives"
import { plugin as isOnlinePlugin } from "regira_modules/vue/online"
import { plugin as debugPlugin } from "regira_modules/vue/debug"
import { preloaderPlugin, usePreloader, defaultPoolCache, PoolCache } from "regira_modules/vue/entities"
import { plugin as authPlugin, LocalStorageTokenManager } from "regira_modules/vue/auth"
import { formatDateTime } from "regira_modules/vue/formatters"
import appConfig, { createConfig, useConfig } from "@/app-config"
import { routerFactory } from "@/router"
import { plugin as userPlugin } from "@/infrastructure/user-plugin"
import { default as entityPlugins } from "@/entities"

import { Entity as Country } from "@/entities/countries"
import { Entity as UnitType } from "@/entities/unit-types"
import { Entity as RelationshipType } from "@/entities/party-relationship-types"

import App from "@/App.vue"
import PimModal from "@/components/layout/PimModal.vue"

// opt in to app-wide component registration (Icon, IconButton, Loading*, Paging, MyModal, Debug)
// — must be set before the plugins install
configureGlobals({ registerComponentsGlobally: true })

// Assets — Bootstrap 5 + icons via npm, library component styles (modal backdrop, autocomplete dropdown)
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "regira_modules/style.css"
import "./assets/theme.scss" // app theme — overrides library --rg-* tokens; must come after style.css
import "./assets/base.scss"
import "./assets/main.scss"
import loadingImg from "@/assets/images/loading.gif"

// load config
fetch(`${appConfig.baseUrl}/config.json?v=${formatDateTime(new Date(), "yyyyMMdd")}`)
    .then((r) => r.json())
    .then(async (config: Record<string, any>) => {
        // start init app
        console.debug("init", { config })
        // config (processed)
        const processedConfig = createConfig(config)
        const { api, includeCredentials } = processedConfig
        const axios = initAxios({ api, includeCredentials })

        // load translations
        const translations = await fetch(`${appConfig.baseUrl}/data/translations.json?v=${formatDateTime(new Date(), "yyyyMMdd")}`).then((r) =>
            r.json()
        )
        const appTranslations = await fetch(`${appConfig.baseUrl}/data/app-translations.json?v=${formatDateTime(new Date(), "yyyyMMdd")}`).then((r) =>
            r.json()
        )
        Object.assign(translations, appTranslations)

        // app
        const app = createApp(App)
        // store
        app.use(createPinia())

        app.use(appPlugin, { culture: processedConfig.culture })

        // services
        app.use(servicesPlugin, {
            configure: (sp: IServiceProvider) => {
                return (
                    sp
                        // axios
                        .add("axios", () => axios)
                        // pooling
                        .add(PoolCache.name, () => defaultPoolCache)
                )
            },
        })

        // UI plugins (registerComponentsGlobally is on — plugins register their components app-wide)
        const appIcons = await fetch(`${appConfig.baseUrl}/data/app-icons.json?v=${formatDateTime(new Date(), "yyyyMMdd")}`).then((r) => r.json())
        app.use(iconPlugin, { icons: appIcons, source: "bs", clearFirst: false })
        app.use(screenPlugin)
        app.use(isOnlinePlugin)
        app.use(loadingPlugin, { img: loadingImg })
        app.use(pagingPlugin)
        app.use(modalPlugin, { Modal: PimModal })
        app.use(feedbackPlugin, { autoHideDelay: 2500 })

        // global components not covered by the plugins (use explicit naming -> functions are renamed when minimized in build)
        app.component("MyAnchor", Anchor)
        app.component("FormSection", FormSection)
        app.component("FormLabel", FormLabel)
        app.component("DateInput", DateInput)
        app.component("NullableCheckBox", NullableCheckBox)
        app.component("NullableLabel", NullableLabel)
        app.component("DescriptionInput", DescriptionInput)

        // lang
        app.use(langPlugin, {
            defaultLang: "en",
            messages: translations,
        })
        const { translate: t, translateMessage, setLangCode } = useLang()

        document.title = translateMessage(processedConfig.title)

        // global directives
        app.use(focus)
        app.use(grow)
        app.use(clickOutside)

        // entities + entity routes
        const entityRoutes: Array<RouteRecordRaw> = []
        app.use(entityPlugins, { routes: entityRoutes })

        // routing
        const router = routerFactory([...entityRoutes])
        app.use(router)

        // preloader
        app.use(preloaderPlugin)

        // debug (needs the router; shows only when ?debug=1 / isDebug)
        app.use(debugPlugin, { isDebug: config.isDebug })

        // auth last (needs the router on the app)
        app.use(authPlugin, {
            enabled: true,
            clientApp: processedConfig.clientApp,
            loginUrl: processedConfig.loginUrl.replace(/{clientApp}/, processedConfig.clientApp),
            tokenManager: new LocalStorageTokenManager(),
            axios,
            onAuthenticationChange: async (auth) => {
                if (auth.isAuthenticated) {
                    app.config.globalProperties.$setAppStatus(AppStatus.Loading)
                    const welcomeMsg = t("welcome", {
                        name: auth.displayName || auth.name,
                    })
                    app.config.globalProperties.$feedback.success(welcomeMsg)

                    // preloading
                    const preloaderTypes = [Country, UnitType, RelationshipType]
                    const { preload } = usePreloader()
                    await preload(preloaderTypes as any)

                    // ready
                    app.config.globalProperties.$setCulture(auth.culture!)
                    app.config.globalProperties.$setAppStatus(AppStatus.Ready)

                    const lang = (Array.isArray(auth.culture) ? (auth.culture![0] as string) : (auth.culture as string)).split("-")[0]
                    setLangCode(lang || "en")

                    document.title = translateMessage(processedConfig.title)

                    console.debug("ready", {
                        app,
                        appConfig: useConfig(),
                        router,
                        routes: router.getRoutes(),
                        cache: defaultPoolCache,
                        icons: (app.config.globalProperties.$icons as any).map,
                    })
                } else {
                    app.config.globalProperties.$feedback.fail(`User logged out`)
                }
            },
        })
        app.use(userPlugin)

        // mount
        app.config.globalProperties.$setAppStatus(AppStatus.Mounting)

        app.mount("#app")

        await whenAppReady()
    })
