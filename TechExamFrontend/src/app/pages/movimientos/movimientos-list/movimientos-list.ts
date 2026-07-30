import { Component, inject, signal } from '@angular/core';
import { MovimientosService } from '../../../../core/services/movimientosService';
import { Movimiento } from '../../../models/movimiento.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movimientos-list',
  imports: [DatePipe],
  templateUrl: './movimientos-list.html',
  styleUrl: './movimientos-list.css',
})
export class MovimientosList {
  private readonly movimientosService = inject(MovimientosService);

  readonly movimientos = signal<Movimiento[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit() {
    this.cargarMovimientos();
  }

  cargarMovimientos() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.movimientosService.obtenerTodos().subscribe({
      next: (movimientos) => {
        this.movimientos.set(movimientos);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar los movimientos');
        this.isLoading.set(false);
      }
    });
  }
}
