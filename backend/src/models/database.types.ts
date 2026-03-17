//export funciona como public en java 
//enum funciona para que estos se puedan acceder desde otros archivos
export enum Role {
    ADMIN = 'ADMIN',
    OPERATOR = 'OPERATOR'
}

export enum MovementType {
    IN = 'IN',
    OUT = 'OUT',
    ADJUSTMENT = 'ADJUSTMENT'
}

export interface User {
    id: string; // UUID
    username: string;
    role: Role;
    active: boolean;
}

export interface Category {
    id: number; // SERIAL
    name: string;
}

export interface Product {
    id: string; // UUID
    sku: string;
    name: string;
    category_id: number; // FK
    price: number;
    current_stock: number;
    min_stock: number;
    created_at: Date;
    updated_at: Date;
}

export interface InventoryMovement {
    id: string; // UUID
    product_id: string; // FK -> Product
    operator_id: string; // FK -> User (Auditoría)
    type: MovementType;
    quantity: number;
    reason?: string; // Opcional
    created_at: Date;
}

export interface StockAlert {
    id: number; // SERIAL
    product_id: string; // FK -> Product
    stock_at_moment: number;
    resolved: boolean;
    created_at: Date;
}