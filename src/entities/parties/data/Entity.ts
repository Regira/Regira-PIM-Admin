import { EntityBase } from "regira_modules/vue/entities"
import type PartyAddress from "../party-addresses/Entity"
import type PartyContactData from "../party-contact-data/Entity"
import type { PartyRelationship } from "../party-relations/Entity"
import { ContactDataTypes } from "../party-contact-data"
import { PartyTypes } from "./PartyTypes"
import { getInitials } from "regira_modules/vue/formatters"

export class Party extends EntityBase {
    id: number = 0
    partyType: string = ""
    code?: string

    title?: string
    // organization
    name: string = ""
    legalEntity?: string
    // person
    salutation?: string
    givenName?: string
    middleName?: string
    familyName?: string

    description?: string

    startDate?: Date
    endDate?: Date

    created?: Date
    lastModified?: Date
    isArchived: boolean = false

    contactData?: PartyContactData[]
    addresses?: PartyAddress[]

    parentRelationships?: Array<PartyRelationship>
    childRelationships?: Array<PartyRelationship>

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.partyType == PartyTypes.Organization
            ? `${this.name ?? ""} ${this.legalEntity ?? ""}`.trim()
            : `${this.givenName ?? ""} ${this.familyName ?? ""}`.trim()
    }

    get $isOrganization() {
        return this.partyType == PartyTypes.Organization
    }
    get $initials(): string {
        const input = this.$isOrganization ? (this.name ?? "") : `${this.givenName ?? ""} ${this.familyName ?? ""}`.trim()
        return getInitials(input ?? "")
    }
    // main address
    get $address(): PartyAddress | undefined {
        if ((this.addresses?.length ?? 0) > 0) {
            return this.addresses![0]
        }
        return undefined
    }
    // main phone
    get $phone(): string | undefined {
        return this.contactData?.filter((x) => ContactDataTypes.phone == x.dataType!).map((x) => x.value)[0]
    }
    // main email
    get $email(): string | undefined {
        return this.contactData?.filter((x) => ContactDataTypes.email === x.dataType).map((x) => x.value)[0]
    }
    // main website
    get $website(): string | undefined {
        return this.contactData?.filter((x) => ContactDataTypes.website === x.dataType).map((x) => x.value)[0]
    }
}

export const Entity = Party

export default Party
