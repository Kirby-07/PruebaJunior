// IA-CONSULTA: El PDF pide implementar al menos un pipe personalizado. ¿Cómo creo uno útil para el dashboard?
// IA-SUGERENCIA: Crear un `MovementTypePipe` que implemente `PipeTransform`. Tomará los valores en inglés del enum del backend ('IN', 'OUT', 'ADJUSTMENT') y retornará etiquetas amigables en español para la vista del usuario.
// IA-DECISION: Filtro estetico propuesto por la IA, nada funcional e innecesario la evaluacion de un switch, en entorno real no serviria, un buen middleware podría ser conectar con un ERP para tener actualizado en otro area el registro financiero
// Similar al patron de arquitectura filtro de tuberias (personalmente para mi es una extension de el patron de n-capas)

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