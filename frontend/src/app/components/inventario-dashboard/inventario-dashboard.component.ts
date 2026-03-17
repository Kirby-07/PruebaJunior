// IA-CONSULTA: ¿Cómo implemento la lógica del InventoryDashboardComponent usando ReactiveFormsModule y el servicio creado, cumpliendo con los filtros y manejo de estados?
// IA-SUGERENCIA: Inyectar `InventoryService` y `FormBuilder`. Crear un `FormGroup` con validadores sincrónicos. Usar `subscribe` para manejar las peticiones HTTP y controlar variables de estado (loading, error, success) para dar feedback visual al usuario.
// IA-DECISION: Se deja la solucion propuesta por la IA puesto que cumple con los requerimientos pero mi falta de conocimiento en Angular no sabria decir si esta optimizado, creeria que si porque al momento de recargar se demora y aca es donde inyectan y tendria que revisar como optimizar

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventario-dashboard',
  standalone:false,
  templateUrl: './inventario-dashboard.component.html',
  styleUrls: ['./inventario-dashboard.component.scss']
})
export class InventarioDashboardComponent implements OnInit {
  // Variables de Estado (Como variables de instancia en Java)
  products: any[] = [];
  alerts: any[] = [];
  
  // Variables para feedback visual
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Nuestro formulario reactivo
  movementForm!: FormGroup;

  // Filtros actuales
  currentCategoryId?: number;
  showLowStockOnly = false;

  // Inyección de dependencias (Como el @Autowired de Spring Boot)
  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder // FormBuilder es un patrón Builder para crear formularios fácilmente
  ) {}

  // ngOnInit es el equivalente a un método @PostConstruct en Java.
  // Se ejecuta automáticamente cuando el componente se inicializa.
  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  // 1. Inicializamos la estructura del formulario y sus validaciones
  private initForm(): void {
    this.movementForm = this.fb.group({
      productId: ['', Validators.required],
      type: ['IN', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]], // No se pueden mover 0 o negativos
      reason: ['']
    });
  }

  // 2. Cargar datos del Backend
  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Observable.subscribe() es equivalente a CompletableFuture.thenAccept() en Java.
    // Es asíncrono: le decimos "cuando el backend responda, ejecuta esta función".
    this.inventoryService.getProducts(this.currentCategoryId, this.showLowStockOnly)
      .subscribe({
        next: (data) => {
          this.products = data;
          this.loadAlerts(); // Cargamos alertas después de los productos
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar productos.';
          this.isLoading = false;
        }
      });
  }

  private loadAlerts(): void {
    this.inventoryService.getActiveAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  // 3. Métodos para la Vista (HTML)
  toggleLowStock(): void {
    this.showLowStockOnly = !this.showLowStockOnly;
    this.loadData(); // Recargamos aplicando el filtro
  }

  onSubmitMovement(): void {
    // Si el formulario es inválido, detenemos la ejecución
    if (this.movementForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Extraemos los datos del formulario
    const formValues = this.movementForm.value;
    const { productId, ...movementData } = formValues; // Separamos el ID del resto del body

    this.inventoryService.registerMovement(productId, movementData).subscribe({
      next: (response) => {
        this.successMessage = 'Movimiento registrado con éxito.';
        this.movementForm.reset({ type: 'IN', quantity: 1 }); // Limpiamos el form
        this.loadData(); // Recargamos la tabla para ver el nuevo stock
      },
      error: (err) => {
        // Mostramos el mensaje de error que definimos en nuestro backend (OperationalError)
        this.errorMessage = err.error?.message || 'Error al registrar el movimiento.';
        this.isLoading = false;
      }
    });
  }
}