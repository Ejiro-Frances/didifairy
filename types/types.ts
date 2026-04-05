export interface Product {
    id: string
    name: string
    description: string
    price: number
    status: 'available' | 'sold_out'
    images: string[]
    color: string
    length: string
    closure?: string
    category: string
    featured?: boolean
}

export interface CartItem {
    product: Product
    quantity: number
}

export interface CustomerReview {
    id: string
    name: string
    handle: string
    image: string
    quote: string
    rating: number
    product: string
}

export interface OrderDetails {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    notes?: string
}