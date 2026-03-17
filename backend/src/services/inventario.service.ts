// IA-CONSULTA: Podrías darme un punto de vista de una logica de negocio para el ejercicio propuesto.
// IA-SUGERENCIA: Propongo implementar la lógica de negocio principal en `InventoryService` añadiendo el método `registerMovement`. Este método validará la existencia del producto, gestionará el stock para entradas/salidas/ajustes, creará un registro de auditoría, y manejará las alertas de stock bajo. Se crea una clase `OperationalError` para un manejo de errores más limpio.
// IA-DECISION: La logica de negocio propuesta y construida con base a IA cumple con los requerimientos solicitados, se dejan comentarios para futuras referencias y facilidad de comprension.

//Similar a la notacion @Service de springboot, esto funciona para identificar que esta clase es el servicio

import { v4 as uuidv4 } from 'uuid';
import { db, MOCK_USER_ID } from '../models/mock.db';
import { Product, MovementType, InventoryMovement, StockAlert } from '../models/database.types';


// Definimos un DTO (Data Transfer Object) para la entrada del método.
export interface RegisterMovementDto {
    type: MovementType;
    quantity: number;
    reason?: string;
}

// Clase de error personalizada para errores de negocio (predecibles).
export class OperationalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'OperationalError';
    }
}

export class InventoryService {

    public getProducts(filters: { categoryId?: number; lowStock?: boolean }): Product[] {
        let filteredProducts = [...db.products]; //Crea copia superficial de la lista de productos para no mutar el mock original

        if (filters.categoryId) //Con este primer if se actualiza la lista de productos si se recibe un id de categoria
        {
            filteredProducts = filteredProducts.filter(p => p.category_id === filters.categoryId);
        }

        if (filters.lowStock === true) //Con este segundo if se actualiza la lista de productos si se recibe true en lowStock
        {
            filteredProducts = filteredProducts.filter(p => p.current_stock < p.min_stock);
        }

        return filteredProducts;
    }

    /**
     * Registra un movimiento de inventario, actualiza el stock y gestiona las alertas.
     * Simula una operación transaccional.
     * @param productId - El ID del producto a modificar.
     * @param movementData - Los datos del movimiento a registrar.
     * @returns El producto actualizado.
     */
    public registerMovement(productId: string, movementData: RegisterMovementDto): Product {
        const product = db.products.find(p => p.id === productId);//Busca el producto por id

        if (!product) {
            throw new OperationalError('Producto no encontrado.');
        }

        const { type, quantity, reason } = movementData; //Se extraen los datos del movimiento

        // 1. Validar y actualizar el stock
        switch (type) {
            case MovementType.IN:
                product.current_stock += quantity;
                break;
            case MovementType.OUT:
                if (product.current_stock < quantity) {
                    throw new OperationalError('Stock insuficiente para realizar la salida.');
                }
                product.current_stock -= quantity;
                break;
            case MovementType.ADJUSTMENT:
                // Un ajuste establece el stock a un valor concreto.
                if (quantity < 0) {
                    throw new OperationalError('El ajuste de stock no puede ser negativo.');
                }
                product.current_stock = quantity;
                break;
        }
        product.updated_at = new Date();

        // 2. Crear el registro de auditoría (movimiento)
        const newMovement: InventoryMovement = {
            id: uuidv4(), //Se genera un id unico para el movimiento
            product_id: productId, //Se asigna el id del producto
            operator_id: MOCK_USER_ID, // Usamos el ID del usuario mockeado
            type,
            quantity,
            reason,
            created_at: new Date(),
        };
        db.inventory_movements.push(newMovement); //Se añade el movimiento a la lista de movimientos para la auditoria

        // 3. Gestionar alertas de stock
        this.handleStockAlerts(product);

        return product;
    }

    /**
     * Lógica encapsulada para crear o resolver alertas de stock para un producto.
     * @param product - El producto cuyo stock ha sido modificado.
     */
    private handleStockAlerts(product: Product): void {
        const existingAlert = db.stock_alerts.find(a => a.product_id === product.id && a.resolved === false);
        const isStockLow = product.current_stock < product.min_stock;

        if (isStockLow && !existingAlert) {
            // El stock está bajo y no hay una alerta activa: crear una nueva.
            const newAlert: StockAlert = {
                id: db.stock_alerts.length + 1, // Simula un SERIAL
                product_id: product.id,
                stock_at_moment: product.current_stock,
                resolved: false,
                created_at: new Date()
            };
            db.stock_alerts.push(newAlert);
        } else if (!isStockLow && existingAlert) {
            // El stock se ha recuperado y había una alerta activa: resolverla.
            existingAlert.resolved = true;
        }
    }
}