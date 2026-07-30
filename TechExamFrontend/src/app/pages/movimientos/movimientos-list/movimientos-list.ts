import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { MovimientosService } from '../../../../core/services/movimientosService';
import { Movimiento } from '../../../models/movimiento.model';
import { DatePipe } from '@angular/common';
import { getApiErrorMessage } from '../../../../core/utils/api-error';

@Component({
  selector: 'app-movimientos-list',
  imports: [DatePipe],
  templateUrl: './movimientos-list.html',
  styleUrl: './movimientos-list.css',
})
export class MovimientosList {
  private readonly movimientosService = inject(MovimientosService);
  private requestRevision = 0;
  private previousEmployeeId: number | null = null;

  readonly refreshRevision = input(0);
  readonly selectedEmployeeId = input<number | null>(null);
  readonly showAllRequested = output<void>();
  readonly movimientos = signal<Movimiento[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly pageNumber = signal(1);
  readonly pageSize = 10;
  readonly totalRecords = signal(0);
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalRecords() / this.pageSize)),
  );
  readonly placeholderRows = computed(() =>
    Array.from({
      length: Math.max(0, this.pageSize - Math.max(1, this.movimientos().length)),
    }),
  );

  constructor() {
    effect(() => {
      this.refreshRevision();
      const employeeId = this.selectedEmployeeId();

      if (employeeId !== this.previousEmployeeId) {
        this.pageNumber.set(1);
        this.previousEmployeeId = employeeId;
      }

      this.cargarMovimientos();
    });
  }

  cargarMovimientos() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    const requestRevision = ++this.requestRevision;
    const employeeId = this.selectedEmployeeId();
    const request = employeeId === null
      ? this.movimientosService.obtenerTodos(this.pageNumber(), this.pageSize)
      : this.movimientosService.obtenerPorEmpleado(
          employeeId,
          this.pageNumber(),
          this.pageSize,
        );

    request.subscribe({
      next: (resultado) => {
        if (requestRevision !== this.requestRevision) {
          return;
        }

        this.movimientos.set(resultado.datos);
        this.totalRecords.set(resultado.totalRegistros);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        if (requestRevision !== this.requestRevision) {
          return;
        }

        this.errorMessage.set(
          getApiErrorMessage(error, 'No fue posible cargar los movimientos. Intenta nuevamente.'),
        );
        this.isLoading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (this.isLoading() || page < 1 || page > this.totalPages() || page === this.pageNumber()) {
      return;
    }

    this.pageNumber.set(page);
    this.cargarMovimientos();
  }

  showAllMovements(): void {
    this.showAllRequested.emit();
  }
}
