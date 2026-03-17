// IA-CONSULTA: El PDF pide implementar al menos un pipe personalizado. ¿Cómo creo uno útil para el dashboard?
// IA-SUGERENCIA: Crear un `MovementTypePipe` que implemente `PipeTransform`. Tomará los valores en inglés del enum del backend ('IN', 'OUT', 'ADJUSTMENT') y retornará etiquetas amigables en español para la vista del usuario.
// IA-DECISION: [DECISIÓN DEL DESARROLLADOR: ]

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'movementType',
  standalone: false
})
export class MovementTypePipe implements PipeTransform {

  // El método 'transform' es obligatorio. Recibe el valor original y devuelve el modificado.
  transform(value: string): string {
    switch (value) {
      case 'IN': return 'Entrada 🟢';
      case 'OUT': return 'Salida 🔴';
      case 'ADJUSTMENT': return 'Ajuste 🟡';
      default: return value;
    }
  }

}