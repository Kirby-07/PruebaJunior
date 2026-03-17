// IA-CONSULTA: ¿Cómo conecto los métodos del controlador a las rutas HTTP reales en Express?
// IA-SUGERENCIA: Utilizar `Router` de Express para crear un módulo de rutas. Instanciar `InventoryController` y mapear los verbos HTTP (GET, POST) y las URLs a los métodos específicos de la clase controladora.
// IA-DECISION: [DECISIÓN DEL DESARROLLADOR: ]

import { Router } from 'express';
import { InventoryController } from '../controllers/inventario.controller';

// Creamos un nuevo Enrutador de Express
const router = Router();
const controller = new InventoryController();

// Mapeamos las rutas HTTP a los métodos de nuestro controlador.
// Nota: Solo pasamos la *referencia* a la función (controller.getProducts), no la ejecutamos ().
// Express se encargará de ejecutarla y pasarle los parámetros (req, res, next) cuando llegue una petición.

router.get('/products', controller.getProducts);
router.get('/alerts', controller.getActiveAlerts);
router.post('/products/:id/movements', controller.registerMovement);

// Exportamos el enrutador para conectarlo en nuestro archivo principal (index.ts)
export default router;