import { Component, effect, inject, input, output, signal } from '@angular/core';
import { EmpleadosService } from '../../../../core/services/empleadosService';
import { Empleado } from '../../../models/empleado.model';
import { DatePipe } from '@angular/common';
import { EmpleadoModal } from '../empleado-modal/empleado-modal';
import { getApiErrorMessage } from '../../../../core/utils/api-error';

@Component({
  selector: 'app-empleados-list',
  imports: [DatePipe, EmpleadoModal],
  templateUrl: './empleados-list.html',
  styleUrl: './empleados-list.css',
})
export class EmpleadosList {
  private readonly empleadosService = inject(EmpleadosService);

  readonly refreshRevision = input(0);
  readonly employeeChanged = output<void>();
  readonly empleados = signal<Empleado[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly isCreateModalOpen = signal(false);
  readonly employeeToEdit = signal<Empleado | null>(null);

  constructor() {
    effect(() => {
      this.refreshRevision();
      this.cargarEmpleados();
    });
  }

  cargarEmpleados() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.empleadosService.obtenerTodos().subscribe({
      next: (empleados) => {
        this.empleados.set(empleados);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(
          getApiErrorMessage(error, 'No fue posible cargar los empleados. Intenta nuevamente.'),
        );
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  employeeCreated(): void {
    this.closeCreateModal();
    this.employeeChanged.emit();
  }

  openEditModal(employee: Empleado): void {
    this.employeeToEdit.set(employee);
  }

  closeEditModal(): void {
    this.employeeToEdit.set(null);
  }

  employeeUpdated(): void {
    this.closeEditModal();
    this.employeeChanged.emit();
  }
}
