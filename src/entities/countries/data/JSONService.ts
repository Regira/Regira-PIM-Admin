import { JSONService } from "regira_modules/vue/entities"
import { useAxios } from "regira_modules/vue/http"
import Country from "./Entity"
import config from "../config/config"

export class CountryService extends JSONService<Country> {
    constructor() {
        super(useAxios(), config, Country.name)
    }

    override toEntity(item: Object): Country {
        return Object.assign(this.createInstance(Country), item)
    }
}

export default CountryService
