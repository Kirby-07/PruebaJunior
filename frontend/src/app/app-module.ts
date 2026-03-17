// IA-CONSULTA: Corregir el AppModule porque quedó una importación basura de 'App' y el árbol de archivos se ve anidado.
// IA-SUGERENCIA: Limpiar el `app.module.ts` eliminando las referencias a `App` y manteniendo únicamente `AppComponent`.
// IA-DECISION: [DECISIÓN DEL DESARROLLADOR: ]

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MovementTypePipe } from './pipes/movement-type-pipe';
import { InventarioDashboardComponent } from './components/inventario-dashboard/inventario-dashboard.component'; // Ajusta la ruta si es necesario

@NgModule({
  declarations: [App, MovementTypePipe, InventarioDashboardComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [App],
})
export class AppModule {}
