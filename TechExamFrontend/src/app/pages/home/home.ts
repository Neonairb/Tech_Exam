import { Component, signal } from '@angular/core';
import { EmpleadosList } from '../empleados/empleados-list/empleados-list';
import { MovimientosList } from '../movimientos/movimientos-list/movimientos-list';

@Component({
  selector: 'app-home',
  imports: [EmpleadosList, MovimientosList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly refreshRevision = signal(0);

  refreshLists(): void {
    this.refreshRevision.update((revision) => revision + 1);
  }
}
