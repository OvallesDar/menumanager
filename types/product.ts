import type { Title } from "./title"

export interface Product {
    id?: string
    title: Title,
    price: string
    isactive: boolean
    categoryid: string
    image: File | null | string
}