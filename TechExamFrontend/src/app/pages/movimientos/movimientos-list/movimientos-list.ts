import { Component, effect, inject, input, signal } from '@angular/core';
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

  constructor() {
    effect(() => {
      this.refreshRevision();
      this.cargarMovimientos();
    });
  }

  cargarMovimientos() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.movimientosService.obtenerTodos().subscribe({
      next: (movimientos) => {
        this.movimientos.set(movimientos);
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
}
