import { User, Category, Product, InventoryMovement, StockAlert, Role } from './database.types';

// Simulamos los UUIDs generados por PostgreSQL (gen_random_uuid())
export const MOCK_USER_ID = 'u123e4567-e89b-12d3-a456-426614174000';
export const MOCK_PRODUCT_1_ID = 'p111e4567-e89b-12d3-a456-426614174111';
export const MOCK_PRODUCT_2_ID = 'p222e4567-e89b-12d3-a456-426614174222';

export const db = {
    users: [
        {
            id: MOCK_USER_ID,
            username: 'operador_juan',
            role: Role.OPERATOR,
            active: true
        }
    ] as User[],

    categories: [
        { id: 1, name: 'Electrónica' },
        { id: 2, name: 'Mobiliario' }
    ] as Category[],

    products: [
        {
            id: MOCK_PRODUCT_1_ID,
            sku: 'LAP-001',
            name: 'Laptop Pro 15"',
            category_id: 1,
            price: 2500000,
            current_stock: 25, // Stock OK (25 > 10)
            min_stock: 10,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            id: MOCK_PRODUCT_2_ID,
            sku: 'SIL-002',
            name: 'Silla Ergonómica X1',
            category_id: 2,
            price: 800000,
            current_stock: 3, // ALERTA: Stock bajo (3 < 5)
            min_stock: 5,
            created_at: new Date(),
            updated_at: new Date()
        }
    ] as Product[],

    inventory_movements: [] as InventoryMovement[],

    stock_alerts: [
        {
            id: 1,
            product_id: MOCK_PRODUCT_2_ID,
            stock_at_moment: 3,
            resolved: false,
            created_at: new Date()
        }
    ] as StockAlert[]
};