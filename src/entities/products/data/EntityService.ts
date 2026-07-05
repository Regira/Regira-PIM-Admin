import type { AxiosInstance, AxiosResponse } from "axios"
import { EntityServiceBase, type IConfig, type ListResult } from "regira_modules/vue/entities"
import { FamilyItem } from "../tree"
import Entity from "./Entity"

export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config)
    }

    protected override prepareItem(item: Entity): Entity {
        item.components = item.components?.filter((x) => !x._deleted) || []
        item.facets = item.facets?.filter((x) => !x._deleted) || []
        item.suppliers = item.suppliers?.filter((x) => !x._deleted) || []
        return item
    }

    override toEntity(item: object): Entity {
        return item instanceof Entity ? item : Object.assign(this.createInstance(Entity as new () => Entity), item || {})
    }

    async getAncestors(ids: Array<number> | number): Promise<Array<FamilyItem>> {
        const queryString = (Array.isArray(ids) ? ids : [ids]).map(id => `ids=${id}`).join("&");
        const fetchUrl = `${this.config.api}/ancestors?${queryString}`;
        const { data: result } = await this.axios.get<ListResult<FamilyItem>>(fetchUrl).then((response: AxiosResponse<ListResult<FamilyItem>>) => response)
        return (result.items || []).map(item => Object.assign(new FamilyItem(), item))
    }
    async getOffspring(ids: Array<number> | number): Promise<Array<FamilyItem>> {
        const queryString = (Array.isArray(ids) ? ids : [ids]).map(id => `ids=${id}`).join("&");
        const fetchUrl = `${this.config.api}/offspring?${queryString}`;
        const { data: result } = await this.axios.get<ListResult<FamilyItem>>(fetchUrl).then((response: AxiosResponse<ListResult<FamilyItem>>) => response)
        return (result.items || []).map(item => Object.assign(new FamilyItem(), item))
    }
    async getFamily(ids: Array<number> | number): Promise<Array<FamilyItem>> {
        const queryString = (Array.isArray(ids) ? ids : [ids]).map(id => `ids=${id}`).join("&");
        const fetchUrl = `${this.config.api}/family?${queryString}`;
        const { data: result } = await this.axios.get<ListResult<FamilyItem>>(fetchUrl).then((response: AxiosResponse<ListResult<FamilyItem>>) => response)
        // const tree = new TreeList<TreeEntity>();
        // tree.init(result.items || [], (value, candidates) => {
        //     const parent = candidates.find(c => c.childId === value.parentId);
        //     return parent ? [parent] : [];
        // });
        // return tree;
        return (result.items || []).map(item => Object.assign(new FamilyItem(), item))
    }
}

export default EntityService
