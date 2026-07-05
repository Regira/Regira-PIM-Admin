import { ref, computed, getCurrentInstance } from "vue"
import { type IConfig, type INavItem, importDashboard, importNavbar, buildNavigationTree, type INavCore } from "regira_modules/vue/entities"
import { useConfig } from "@/app-config"

export function useNavigation() {
    const app = getCurrentInstance()!

    const {
        navigation: { groups, dashboard, navbar, search, sidebar },
    } = useConfig()

    const configs = Object.entries(app.appContext.config.globalProperties.$configs).map(([, config]) => config as IConfig)

    function hasAccess(config: IConfig): boolean {
        return true
    }

    const dashboardItems = ref<Array<INavCore>>()
    const dashboardTree = computed(() => {
        dashboardItems.value = importDashboard({
            groups: groups!,
            entities: dashboard!,
            configs,
            hasAccess,
        })
        return buildNavigationTree(dashboardItems.value)
    })
    const navbarItems = ref<Array<INavCore>>()
    const navbarTree = computed(() => {
        navbarItems.value = importNavbar({
            groups,
            entities: navbar!,
            configs,
            hasAccess,
        }) as Array<INavItem>
        const tree = buildNavigationTree(navbarItems.value)
        return tree
    })

    const searchItemConfig = computed<IConfig>(() => configs.find((c) => c.key == search)!)

    const sidebarItems = ref<Array<string>>(sidebar ?? [])

    return {
        dashboardTree,
        navbarTree,
        searchItemConfig,
        sidebarItems,
    }
}
