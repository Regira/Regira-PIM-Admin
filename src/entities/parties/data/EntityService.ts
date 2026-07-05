import type { AxiosInstance, AxiosResponse } from "axios"
import { EntityServiceBase, type IConfig, type ListResult } from "regira_modules/vue/entities"
import Entity from "./Entity"
import { PartyRelationship } from "../party-relations/Entity"
import { FamilyItem } from "../tree"

export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config)
    }

    protected override prepareItem(item: Entity): Entity {
        item.addresses = item.addresses?.filter((x) => !x._deleted)
        item.contactData = item.contactData?.filter((x) => !x._deleted)
        item.parentRelationships = item.parentRelationships
            ?.filter((x) => !x._deleted)
            .map((x) => PartyRelationship.create({ ...x, contactData: x.contactData?.filter((cd) => !cd._deleted) }))
        item.childRelationships = item.childRelationships
            ?.filter((x) => !x._deleted)
            .map((x) => PartyRelationship.create({ ...x, contactData: x.contactData?.filter((cd) => !cd._deleted) }))
        return item
    }

    override toEntity(item: object): Entity {
        if (item instanceof Entity) {
            return item
        }
        return Object.assign(new Entity(), item)
    }

    async getFamily(ids: Array<number> | number): Promise<Array<FamilyItem>> {
        const queryString = (Array.isArray(ids) ? ids : [ids]).map((id) => `ids=${id}`).join("&")
        const fetchUrl = `${this.config.api}/family?${queryString}`
        const { data: result } = await this.axios
            .get<ListResult<FamilyItem>>(fetchUrl)
            .then((response: AxiosResponse<ListResult<FamilyItem>>) => response)
        return (result.items || []).map((item) => Object.assign(new FamilyItem(), item))
    }
}

export default EntityService
