import { Component, signal } from '@angular/core';
import { EmpleadosList } from '../empleados/empleados-list/empleados-list';
import { MovimientosList } from '../movimientos/movimientos-list/movimientos-list';
import { Empleado } from '../../models/empleado.model';

@Component({
  selector: 'app-home',
  imports: [EmpleadosList, MovimientosList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly refreshRevision = signal(0);
  readonly selectedEmployeeId = signal<number | null>(null);
  readonly selectedEmployeeName = signal('');

  refreshLists(): void {
    this.refreshRevision.update((revision) => revision + 1);
  }

  selectEmployee(employee: Empleado): void {
    this.selectedEmployeeId.set(employee.idEmpleado);
    this.selectedEmployeeName.set(employee.nombre);
  }

  clearEmployeeSelection(): void {
    this.selectedEmployeeId.set(null);
    this.selectedEmployeeName.set('');
  }
}
