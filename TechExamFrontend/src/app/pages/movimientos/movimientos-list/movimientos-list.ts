import { Component, computed, effect, inject, input, signal } from '@angular/core';
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

  readonly refreshRevision = input(0);
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
      this.cargarMovimientos();
    });
  }

  cargarMovimientos() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.movimientosService.obtenerTodos(this.pageNumber(), this.pageSize).subscribe({
      next: (resultado) => {
        this.movimientos.set(resultado.datos);
        this.totalRecords.set(resultado.totalRegistros);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
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
}
