# Sistema de Gestión de Inventario E-Commerce

Este proyecto implementa el backend (Node.js/Express) y frontend (Angular) para la gestión del inventario de una plataforma de e-commerce, cumpliendo con los requerimientos de control de stock, alertas y mantenibilidad.

## Decisiones de Arquitectura (ADR)

1. **Arquitectura por Capas (Separación de Responsabilidades):** Se adoptó un patrón Controller-Service-Repository (similar a Spring Boot). Los controladores manejan exclusivamente el protocolo HTTP, mientras que los servicios encapsulan la lógica de negocio pura. Esto facilita el testing unitario y el futuro reemplazo del mock por un ORM real.
2. **Manejo de Errores Centralizado:** Se implementó un middleware en Express (errorHandler) que intercepta todas las excepciones. Distingue entre errores operativos (ej. "Stock insuficiente" -> 400 Bad Request) y errores no controlados (-> 500 Internal Server Error), estandarizando la respuesta JSON para el frontend.
3. **Modelado de Datos y Escalabilidad (PostgreSQL):**
   - Esquema en 3NF con UUIDs: Tablas transaccionales usan UUID v4 previendo escalabilidad horizontal (sharding) sin colisión de IDs.
   - Prevención N a N: Para mantener integridad 1:N actual y prever requerimientos futuros (ej. un producto en múltiples categorías), se documenta el uso de tipos nativos ARRAY (category_ids INTEGER[]) o JSONB de Postgres, evitando costosas tablas intermedias.
   - Concurrencia e Integridad (ACID): El registro de movimientos se procesa atómicamente. Dado que operadores humanos actúan simultáneamente, el diseño asume delegar la concurrencia a la base de datos mediante bloqueos a nivel de fila (Row-level locks) o restas relativas (UPDATE products SET stock = stock - X WHERE stock >= X), previniendo condiciones de carrera. Durante esta prueba, se simula este comportamiento en memoria.

## Modelo de Datos (PostgreSQL)

El sistema utiliza el siguiente esquema relacional, preparado para trazabilidad de usuarios:

- **users**:
  - id (UUID PK)
  - username (UNIQUE)
  - role (ENUM: ADMIN, OPERATOR)
  - active (BOOLEAN).
- **categories**:
  - id (SERIAL PK)
  - name (UNIQUE).
- **products**:
  - id (UUID PK)
  - sku (UNIQUE)
  - name
  - category_id (FK a categories)
  - price
  - current_stock
  - min_stock
  - created_at
  - updated_at.
- **inventory_movements (Tabla de Auditoría)**:
  - id (UUID PK)
  - product_id (FK a products)
  - operator_id (FK a users) (Nuevo: Rastreo de autoría)
  - type (ENUM: IN, OUT, ADJUSTMENT)
  - quantity (INTEGER)
  - reason (TEXT)
  - created_at (TIMESTAMP)
- **stock_alerts**:
  - id (SERIAL PK)
  - product_id (FK a products)
  - stock_at_moment
  - resolved (BOOLEAN)
  - created_at.

## Especificación de la API REST (Endpoints)

### 1. Consultar Catálogo de Productos

- **Método:** `GET`
- **Ruta:** `/api/productos`
- **Query Params (Opcionales):** `?categoryId={id}&lowStock={true|false}`
- **Descripción:** Retorna la lista de productos. Permite aplicar filtros para visualizar inventario por categoría o aquellos en estado crítico.

### 2. Registrar Movimiento de Stock

- **Método:** `POST`
- **Ruta:** `/api/productos/:id/movimientos`
- **Body:**
  ```json
  {
    "type": "IN", // "IN", "OUT", "ADJUSTMENT"
    "quantity": 10,
    "reason": "Reabastecimiento"
  }
  ```
- **Descripción:** Registra el movimiento de auditoría y actualiza el stock actual. Si un movimiento `OUT` reduce el stock por debajo del mínimo, genera una alerta. Retorna error 400 (OperationalError) si la cantidad excede el stock actual en salidas.

### 3. Consultar Alertas Activas

- **Método:** `GET`
- **Ruta:** `/api/alertas`
- **Descripción:** Retorna todas las alertas de stock no resueltas cruzando la información con la tabla de productos para mostrar nombres y SKUs.

## Setup y Despliegue (Entorno de Desarrollo)

El proyecto está completamente dockerizado para garantizar paridad entre entornos (Dev/Prod) y evitar el clásico "en mi máquina sí funciona".

### Prerrequisitos

1. Tener **Docker Desktop** (o Docker Engine) y **Docker Compose** instalados.
2. Asegurarse de tener libres los puertos `3000` (Backend) y `4200` (Frontend) en tu máquina local.
3. Tener la version de **Node 24.14.0**

### Instrucciones de Ejecución

1. Clona el repositorio y abre una terminal en la raíz del proyecto (`/inventario-app`).
2. Ejecuta el siguiente comando para construir las imágenes y levantar los contenedores en segundo plano (o sin `-d` para ver los logs):
   ```bash
   docker compose up --build
   ```
