import { EntityBase } from "regira_modules/vue/entities"
import type Party from "@/entities/parties/data/Entity"

export class ProductSupplier extends EntityBase {
    id: number = 0
    productId: number
    supplierId: number

    supplier?: Party
    _deleted: boolean = false

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.supplier?.$title
    }

    static create(values?: object): ProductSupplier {
        return Object.assign(new ProductSupplier(), values || {})
    }
}

export const Entity = ProductSupplier

export default ProductSupplier
