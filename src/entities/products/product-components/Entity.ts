import { EntityBase } from "regira_modules/vue/entities"
import type Product from "../data/Entity"

export class ProductComponent extends EntityBase {
    id: number = 0
    assemblyId: number
    componentId: number
    quantity: number
    isOmittable: boolean

    component?: Product

    _deleted: boolean = false

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.component?.title
    }

    static create(values?: object): ProductComponent {
        return Object.assign(new ProductComponent(), values || {})
    }
}

export const Entity = ProductComponent

export default ProductComponent
