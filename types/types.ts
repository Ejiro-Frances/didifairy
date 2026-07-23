export interface Product {
    id: string
    name: string
    description: string
    price: number
    status: 'available' | 'sold_out'
    quantity?: number
    images: string[]
    video?: string
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

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed'
export type PaymentMethod = 'transfer' | 'card'
export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface OrderItem {
    productId: string
    productName: string
    quantity: number
    price: number
}

export interface CustomerProfile {
    fullName: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    notes?: string
}

export interface Profile {
    id: string
    fullName: string
    email: string
    phone: string
    address?: string
    city?: string
    state?: string
    createdAt: string
}

export interface ContactMessage {
    id: string
    name: string
    email: string
    phone?: string
    message: string
    createdAt: string
}

export interface Order {
    id: string
    orderNumber: string
    customer: CustomerProfile
    items: OrderItem[]
    total: number
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    status: OrderStatus
    trackingCode: string
    receiptUrl?: string
    userId?: string | null
    createdAt: string
    updatedAt: string
}