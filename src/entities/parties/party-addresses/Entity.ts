import { EntityBase } from "regira_modules/vue/entities"

export class PartyAddress extends EntityBase {
    id: number = 0
    partyId: number = 0
    title?: string

    street?: string
    houseNumber?: string
    unitNumber?: string
    postBox?: string
    postalCode?: string
    city?: string
    stateOrProvince?: string
    countryCode?: string
    description?: string

    sortOrder: number = 0

    _deleted?: boolean = false

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title ?? `${this.street} ${this.houseNumber}, ${this.postalCode} ${this.city}`.trim()
    }

    static create(values?: object): PartyAddress {
        return Object.assign(new PartyAddress(), values || {})
    }
}

export const Entity = PartyAddress

export default PartyAddress
