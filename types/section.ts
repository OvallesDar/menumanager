import { Category } from "./category"

export interface Section {
    id?: string
    title: {
        es: string
        en: string
        fr: string
    },
    isactive: boolean
    categories: Category[]
}