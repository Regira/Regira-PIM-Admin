import { type App, watch } from "vue"
import { useAuthStore } from "regira_modules/vue/auth"
import { useLang } from "regira_modules/vue/lang"
import Permissions from "@/infrastructure/permissions"

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $isAdmin: boolean
        $isDebug: boolean
        $setDebug: (value?: boolean) => boolean
    }
}

export const plugin = {
    install(app: App) {
        const authStore = useAuthStore()
        Object.defineProperties(app.config.globalProperties, {
            $isAdmin: {
                get: () => authStore.authData.hasPermission(Permissions.ADMIN),
                enumerable: true,
                configurable: true,
            },
        })

        // make langCode persistent
        const { langCode, setLangCode } = useLang()
        const lastLangCode = localStorage.getItem("lang")
        if (!authStore.isAuthenticated && lastLangCode && lastLangCode != langCode.value) {
            setLangCode(lastLangCode.substring(0, 2))
        }
        watch(langCode, (newLangCode) => {
            localStorage.setItem("lang", newLangCode)
        })
    },
}

export default plugin
