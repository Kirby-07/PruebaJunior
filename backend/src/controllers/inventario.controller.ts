// IA-CONSULTA: 
// IA-SUGERENCIA: Crear el `InventoryController` para manejar las peticiones HTTP (GET productos, POST movimiento, GET alertas). Utilizar los tipos `Request`, `Response` y `NextFunction` de Express. Implementar un bloque try-catch para derivar los errores al middleware centralizado usando `next(error)`.
// IA-DECISION: [DECISIÓN DEL DESARROLLADOR: ]

import { Request, Response, NextFunction } from 'express';
import { InventoryService, RegisterMovementDto } from '../services/inventario.service';
import { db } from '../models/mock.db'; // Importamos la DB mockeada temporalmente para las alertas

export class InventoryController {
    // Instanciamos nuestro servicio (En Spring esto se haría con @Autowired)
    private inventoryService: InventoryService;

    constructor() {
        this.inventoryService = new InventoryService();
    }

    /**
     * Endpoint: GET /api/productos
     * Equivalente a @GetMapping("/api/productos") en Spring Boot
     */
    public getProducts = (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
            const lowStock = req.query.lowStock === 'true';

            // Llamamos a nuestro servicio de negocio
            const products = this.inventoryService.getProducts({ categoryId, lowStock });

            // Devolvemos HTTP 200 OK con el JSON de respuesta
            res.status(200).json(products);
        } catch (error) {
            // Si algo explota, se lo pasamos al manejador global de errores (ControllerAdvice)
            next(error);
        }
    };

    /**
     * Endpoint: POST /api/productos/:id/movimientos
     * Equivalente a @PostMapping("/api/productos/{id}/movimientos")
     */
    public registerMovement = (req: Request, res: Response, next: NextFunction) => {
        try {
            // req.params obtiene variables de la ruta (/api/productos/123 -> id = "123")
            const productId = req.params.id; 
            
            // req.body obtiene el JSON que envió el cliente en la petición POST (@RequestBody)
            const movementData: RegisterMovementDto = req.body;

            // Delegamos la lógica pesada al servicio
            const updatedProduct = this.inventoryService.registerMovement(productId, movementData);

            // Devolvemos HTTP 201 Created
            res.status(201).json({
                message: 'Movimiento registrado con éxito',
                product: updatedProduct
            });
        } catch (error) {
            // Aquí es donde brillará nuestra clase 'OperationalError'.
            // El middleware global atrapará este error y devolverá un HTTP 400.
            next(error);
        }
    };

    /**
     * Endpoint: GET /api/alertas
     */
    public getActiveAlerts = (req: Request, res: Response, next: NextFunction) => {
        try {
            // Para mantenerlo simple, consultamos el mock directamente aquí.
            // En una app real, esto también iría en el InventoryService llamando al Repository.
            const activeAlerts = db.stock_alerts.filter(alert => alert.resolved === false);

            // Enriquecemos la alerta con los datos del producto (Un "JOIN" manual en memoria)
            const enrichedAlerts = activeAlerts.map(alert => {
                const product = db.products.find(p => p.id === alert.product_id);
                return {
                    ...alert, // spread operator: copia todas las propiedades de alert
                    product_name: product?.name,
                    sku: product?.sku
                };
            });

            res.status(200).json(enrichedAlerts);
        } catch (error) {
            next(error);
        }
    };
}