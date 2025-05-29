import type { Product } from "./product"
import type { Title } from "./title"


export interface Category {
    id?: string
    title: Title,
    isactive: boolean
    sectionid: string
    products: Product[]
}