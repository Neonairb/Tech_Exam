import { Component, effect, inject, input, output, signal } from '@angular/core';
import { EmpleadosService } from '../../../../core/services/empleadosService';
import { Empleado } from '../../../models/empleado.model';
import { DatePipe } from '@angular/common';
import { EmpleadoModal } from '../empleado-modal/empleado-modal';
import { getApiErrorMessage } from '../../../../core/utils/api-error';
import Swal from 'sweetalert2';

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
  readonly employeeBeingDeactivated = signal<number | null>(null);

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

  async deactivateEmployee(employee: Empleado): Promise<void> {
    if (this.employeeBeingDeactivated() !== null) {
      return;
    }

    const confirmation = await Swal.fire({
      icon: 'warning',
      title: 'Dar de baja al empleado',
      text: `¿Confirmas que deseas dar de baja a ${employee.nombre}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      background: 'var(--app-surface)',
      color: 'var(--app-text)',
      confirmButtonColor: '#b94f4f',
      cancelButtonColor: 'var(--app-surface-hover)',
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    this.employeeBeingDeactivated.set(employee.idEmpleado);

    this.empleadosService.darDeBajaEmpleado(employee.idEmpleado).subscribe({
      next: () => {
        this.employeeBeingDeactivated.set(null);
        this.employeeChanged.emit();

        void Swal.fire({
          icon: 'success',
          title: 'Empleado dado de baja',
          text: `${employee.nombre} ahora aparece como inactivo.`,
          confirmButtonText: 'Entendido',
          background: 'var(--app-surface)',
          color: 'var(--app-text)',
          confirmButtonColor: 'var(--app-accent)',
        });
      },
      error: (error: unknown) => {
        this.employeeBeingDeactivated.set(null);

        void Swal.fire({
          icon: 'error',
          title: 'No se pudo dar de baja',
          text: getApiErrorMessage(
            error,
            'No fue posible dar de baja al empleado. Intenta nuevamente.',
          ),
          confirmButtonText: 'Entendido',
          background: 'var(--app-surface)',
          color: 'var(--app-text)',
          confirmButtonColor: 'var(--app-accent)',
        });
      },
    });
  }
}
