// IA-CONSULTA: 
// IA-SUGERENCIA: Configurar la aplicación Express en `index.ts`. Incluir middlewares globales como CORS y parseo de JSON. Montar las rutas del inventario bajo un prefijo como `/api`. Es vital que el `errorHandler` se monte al final, después de todas las rutas, para que pueda interceptar cualquier error lanzado mediante `next(error)`.
// IA-DECISION: [DECISIÓN DEL DESARROLLADOR: ]

import express from 'express';
import cors from 'cors';
import inventoryRoutes from './routes/inventario.routes';
import { errorHandler } from './middlewares/error.middleware';

// Instanciamos el servidor Express (Como levantar un Tomcat)
const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. Middlewares Globales (Filtros de Entrada)
// ==========================================

// CORS: Permite que nuestro Frontend en Angular (puerto 4200) consulte este Backend.
app.use(cors());

// Equivalente a la configuración de Jackson en Spring: permite a Express entender el body en formato JSON.
app.use(express.json()); 


// ==========================================
// 2. Rutas de la API (Controllers)
// ==========================================

// Todas las rutas definidas en 'inventoryRoutes' tendrán el prefijo '/api'
// Ejemplo: POST /api/products/:id/movements
app.use('/api', inventoryRoutes);


// ==========================================
// 3. Middleware de Manejo de Errores
// ==========================================

// ¡MUY IMPORTANTE! El manejador de errores DEBE ser el último app.use()
// Si una ruta lanza un error, Express se lo pasa al siguiente middleware que tenga 4 parámetros.
app.use(errorHandler);


// ==========================================
// 4. Inicialización del Servidor
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend ejecutándose en http://localhost:${PORT}`);
    console.log(`📦 Rutas habilitadas:`);
    console.log(`   - GET  /api/productos`);
    console.log(`   - GET  /api/alertas`);
    console.log(`   - POST /api/productos/:id/movimientos`);
});