import { EntityBase } from "regira_modules/vue/entities"
import type Product from "../data/Entity"

export class ProductAssembly extends EntityBase {
    id: number = 0
    assemblyId: number
    componentId: number
    quantity: number = 1
    isOmittable: boolean

    assembly?: Product
    component?: Product

    _deleted: boolean = false

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.assembly?.title
    }

    static create(values?: object): ProductAssembly {
        return Object.assign(new ProductAssembly(), values || {})
    }
}

export const Entity = ProductAssembly

export default ProductAssembly
