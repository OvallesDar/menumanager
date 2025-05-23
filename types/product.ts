export interface Product {
    id?: string
    title: {
        es: string
        en: string
        fr: string
    },
    price: string
    isactive: boolean
    categoryid: string
    image: File | null | string
}