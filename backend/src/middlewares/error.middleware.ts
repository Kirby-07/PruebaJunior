// IA-CONSULTA: Pregunte como implementar middleware de errores en Express con TypeScript.
// IA-SUGERENCIA: Uso de NextFunction con parametro error tipado como unknown.
// IA-DECISION: El middleware propuesto y construido con base a IA cumple con los requerimientos solicitados, se dejan comentarios para futuras referencias y facilidad de comprension.

import { Request, Response, NextFunction } from 'express';
import { OperationalError } from '../services/inventario.service';

export const errorHandler = (
    err: unknown, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    // 1. Log del error para auditoría interna (En producción usaríamos Winston o Datadog)
    console.error(`[Error] ${req.method} ${req.url} -`, err);

    // 2. Si el error es de nuestra clase "OperationalError" (Ej. "Stock insuficiente")
    // Sabemos que es un error de negocio por culpa del cliente, devolvemos un 400 Bad Request.
    if (err instanceof OperationalError) {
        return res.status(400).json({
            status: 'error',
            type: 'OperationalError',
            message: err.message
        });
    }

    // 3. Si es un error de sintaxis en el JSON del Body (Ej. mandaron una coma de más)
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            status: 'error',
            type: 'SyntaxError',
            message: 'El formato del JSON enviado es inválido.'
        });
    }

    // 4. Si es cualquier otro error (Ej. Base de datos caída, NullPointer, etc.)
    // Devolvemos un 500 Internal Server Error genérico para no exponer información sensible.
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return res.status(500).json({
        status: 'error',
        type: 'InternalServerError',
        message: 'Ocurrió un error inesperado en el servidor.'
    });
};