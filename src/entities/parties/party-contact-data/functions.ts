import { isEmail, isUrl, isPhone } from "regira_modules/utilities/string-utility"
import ContactDataTypes from "./ContactDataTypes"
import type Entity from "./Entity"

export function getDataType(item?: Entity): ContactDataTypes | undefined {
    if (item == null) {
        return undefined
    }
    return isPhone(item.value)
        ? ContactDataTypes.phone
        : isEmail(item.value)
          ? ContactDataTypes.email
          : isUrl(item.value)
            ? ContactDataTypes.website
            : undefined
}
