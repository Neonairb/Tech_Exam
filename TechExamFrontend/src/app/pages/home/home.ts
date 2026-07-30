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
  readonly selectedEmployeeId = signal<number | null>(null);

  refreshLists(): void {
    this.refreshRevision.update((revision) => revision + 1);
  }

  selectEmployee(idEmpleado: number): void {
    this.selectedEmployeeId.set(idEmpleado);
  }

  clearEmployeeSelection(): void {
    this.selectedEmployeeId.set(null);
  }
}
