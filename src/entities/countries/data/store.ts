import { defineStore } from "pinia"
import { createStore, type IEntityService } from "regira_modules/vue/entities"
import { get } from "regira_modules/vue/ioc"
import Entity from "./Entity"

export const useEntityStore = defineStore(Entity.name, () => {
    const service = get<IEntityService<Entity>>(Entity.name)!
    return createStore<Entity>(service, Entity.name)
})

export default useEntityStore
