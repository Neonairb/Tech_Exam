import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
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
  readonly selectedEmployeeId = input<number | null>(null);
  readonly employeeChanged = output<void>();
  readonly employeeSelected = output<number>();
  readonly empleados = signal<Empleado[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly isCreateModalOpen = signal(false);
  readonly employeeToEdit = signal<Empleado | null>(null);
  readonly employeeBeingDeactivated = signal<number | null>(null);
  readonly pageNumber = signal(1);
  readonly pageSize = 10;
  readonly totalRecords = signal(0);
  readonly totalActive = signal(0);
  readonly totalInactive = signal(0);
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalRecords() / this.pageSize)),
  );
  readonly placeholderRows = computed(() =>
    Array.from({
      length: Math.max(0, this.pageSize - Math.max(1, this.empleados().length)),
    }),
  );

  constructor() {
    effect(() => {
      this.refreshRevision();
      this.cargarEmpleados();
    });
  }

  cargarEmpleados() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.empleadosService.obtenerTodos(this.pageNumber(), this.pageSize).subscribe({
      next: (resultado) => {
        this.empleados.set(resultado.datos);
        this.totalRecords.set(resultado.totalRegistros);
        this.totalActive.set(resultado.totalActivos ?? 0);
        this.totalInactive.set(resultado.totalInactivos ?? 0);
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

  goToPage(page: number): void {
    if (this.isLoading() || page < 1 || page > this.totalPages() || page === this.pageNumber()) {
      return;
    }

    this.pageNumber.set(page);
    this.cargarEmpleados();
  }

  selectEmployee(employee: Empleado): void {
    this.employeeSelected.emit(employee.idEmpleado);
  }

  handleEmployeeKeydown(event: KeyboardEvent, employee: Empleado): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.selectEmployee(employee);
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
