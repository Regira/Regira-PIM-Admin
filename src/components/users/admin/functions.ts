import type { Router } from "vue-router"
import { useAxios } from "regira_modules/vue/http"
import { useConfig } from "@/app-config"
import Permissions from "@/infrastructure/permissions"
import Entity from "./Entity"

export async function saveUser(item: Entity, siteUrl?: string): Promise<Entity> {
    const axios = useAxios()
    if (item.permissions.includes(Permissions.CAN_WRITE)) {
        if (!item.permissions.includes(Permissions.CAN_READ)) {
            item.permissions.push(Permissions.CAN_READ)
        }
    }
    const response = await axios.post("/users", { ...item, siteUrl })
    return Object.assign(new Entity(), response.data)
}

export function buildConfirmEmailUrl(router: Router): string {
    const { baseUrl } = useConfig()
    const confirmEmailRoute = router.resolve({ name: "confirmEmail" })
    return `${location.protocol}//${location.host}${baseUrl}${confirmEmailRoute.fullPath}`
}

export function isAdmin(item: Entity): boolean {
    return item?.permissions?.includes(Permissions.ADMIN) ?? false
}
