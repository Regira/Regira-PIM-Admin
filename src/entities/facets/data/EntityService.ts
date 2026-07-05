import type { AxiosInstance, AxiosResponse } from "axios"
import { EntityServiceBase, type IConfig, type ListResult } from "regira_modules/vue/entities"
import { FamilyItem } from "../tree"
import Entity from "./Entity"

export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config)
    }

    protected override prepareItem(item: Entity): Entity {
        item.childEntities = item.childEntities?.filter((x) => !x._deleted) || []
        item.parentEntities = item.parentEntities?.filter((x) => !x._deleted) || []
        item.facetParentGroups = item.facetParentGroups?.filter((x) => !x._deleted) || []
        item.facetChildGroups = item.facetChildGroups?.filter((x) => !x._deleted) || []
        return item
    }

    override toEntity(item: object): Entity {
        return item instanceof Entity ? item : Object.assign(this.createInstance(Entity as new () => Entity), item || {})
    }

    async getFamily(ids?: Array<number> | number, groupIds?: Array<number> | number, level?: number): Promise<Array<FamilyItem>> {
        const queryString = (Array.isArray(ids) ? ids : [ids])
            .map((id) => `ids=${id}`)
            .concat(groupIds ? (Array.isArray(groupIds) ? groupIds : [groupIds]).map((id) => `groupIds=${id}`) : [])
            .join("&")
        const fetchUrl = `${this.config.api}/family?${queryString}`
        const { data: result } = await this.axios
            .get<ListResult<FamilyItem>>(fetchUrl)
            .then((response: AxiosResponse<ListResult<FamilyItem>>) => response)
        return (result.items || []).map((item) => Object.assign(new FamilyItem(), item))
    }
}

export default EntityService
