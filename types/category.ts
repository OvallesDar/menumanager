import { Product } from "./product"

export interface Category {
    id?: string
    title: {
        es: string
        en: string
        fr: string
    },
    isactive: boolean
    sectionid: string
    products: Product[]
}