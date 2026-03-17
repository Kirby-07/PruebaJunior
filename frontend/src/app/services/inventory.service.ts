// IA-CONSULTA: ¿Cómo creo el servicio `InventoryService` en Angular para consumir mi API de Node.js?
// IA-SUGERENCIA: Inyectar `HttpClient` en el constructor del servicio. Definir métodos para GET, POST, y consultar alertas. Usar Observables (el estándar en Angular) para manejar las respuestas de forma asíncrona.
// IA-DECISION: [DECISIÓN DEL DESARROLLADOR: ]

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ¡Esto es como un @Service en Spring, Angular lo inyecta solo!
})
export class InventoryService {
  private apiUrl = 'http://localhost:3000/api'; // La URL de tu backend

  constructor(private http: HttpClient) {} // 'private http: HttpClient' es como @Autowired en Spring.

  // Analogía: public List<Product> getProducts()
  getProducts(categoryId?: number, lowStock?: boolean): Observable<any> {
    let params: any = {};
    if (categoryId) params.categoryId = categoryId;
    if (lowStock) params.lowStock = lowStock;

    return this.http.get(`${this.apiUrl}/productos`, { params });
  }

  // Analogía: public void registerMovement(String id, MovementDto data)
  registerMovement(id: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos/${id}/movimientos`, data);
  }

  getActiveAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alerts`);
  }
}