import type { Category } from "./category"
import type { Title } from "./title"

export interface Section {
    id?: string
    title: Title,
    isactive: boolean
    categories?: Category[]
}