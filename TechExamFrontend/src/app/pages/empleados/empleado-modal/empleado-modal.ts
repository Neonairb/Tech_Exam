import { Component, effect, HostListener, inject, input, output, signal } from '@angular/core';
import { EmpleadosService } from '../../../../core/services/empleadosService';
import { Empleado } from '../../../models/empleado.model';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { getApiErrorMessage } from '../../../../core/utils/api-error';

@Component({
  selector: 'app-empleado-modal',
  templateUrl: './empleado-modal.html',
  styleUrl: './empleado-modal.css',
})
export class EmpleadoModal {
  private readonly empleadosService = inject(EmpleadosService);

  readonly mode = input<'create' | 'edit'>('create');
  readonly employee = input<Empleado | null>(null);
  readonly closed = output<void>();
  readonly saved = output<Empleado>();
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');
  readonly idErrorMessage = signal('');
  readonly nameErrorMessage = signal('');
  readonly employeeId = signal('');
  readonly employeeName = signal('');

  constructor() {
    effect(() => {
      const employee = this.employee();

      if (this.mode() === 'edit' && employee) {
        this.employeeId.set(String(employee.idEmpleado));
        this.employeeName.set(employee.nombre);
      }
    });
  }

  @HostListener('document:keydown.escape')
  closeWithEscape(): void {
    this.close();
  }

  close(): void {
    if (!this.isSaving()) {
      this.closed.emit();
    }
  }

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  updateEmployeeId(event: Event): void {
    this.employeeId.set((event.target as HTMLInputElement).value);
    this.idErrorMessage.set('');
  }

  updateEmployeeName(event: Event): void {
    this.employeeName.set((event.target as HTMLInputElement).value);
    this.nameErrorMessage.set('');
  }

  save(event: SubmitEvent): void {
    event.preventDefault();
    const idEmpleado = Number(this.employeeId());
    const nombre = this.employeeName().trim();
    const isEditing = this.mode() === 'edit';

    this.idErrorMessage.set('');
    this.nameErrorMessage.set('');

    if (!isEditing && (!Number.isInteger(idEmpleado) || idEmpleado < 1)) {
      this.idErrorMessage.set('El ID debe ser un número entero mayor que cero.');
    }

    if (!nombre) {
      this.nameErrorMessage.set('El nombre es obligatorio.');
    } else if (nombre.length > 50) {
      this.nameErrorMessage.set('El nombre no puede exceder los 50 caracteres.');
    }

    if (this.idErrorMessage() || this.nameErrorMessage() || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    const request$ = isEditing
      ? this.empleadosService.actualizarEmpleado(idEmpleado, { nombre })
      : this.empleadosService.crearEmpleado({ idEmpleado, nombre });

    request$.subscribe({
      next: (employee) => {
        this.saved.emit(employee);

        void Swal.fire({
          icon: 'success',
          title: isEditing ? 'Empleado actualizado' : 'Empleado creado',
          text: isEditing
            ? `Los datos de ${employee.nombre} se actualizaron correctamente.`
            : `${employee.nombre} fue agregado correctamente.`,
          confirmButtonText: 'Entendido',
          background: 'var(--app-surface)',
          color: 'var(--app-text)',
          confirmButtonColor: 'var(--app-accent)',
        });
      },
      error: (error: unknown) => {
        const fallback = isEditing
          ? 'No fue posible actualizar el empleado. Intenta nuevamente.'
          : 'No fue posible guardar el empleado. Intenta nuevamente.';
        const message = getApiErrorMessage(error, fallback);

        if (error instanceof HttpErrorResponse && error.status === 400) {
          this.idErrorMessage.set(getApiErrorMessage(error, '', 'IdEmpleado'));
          this.nameErrorMessage.set(getApiErrorMessage(error, '', 'Nombre'));
          this.errorMessage.set(
            this.idErrorMessage() || this.nameErrorMessage() ? '' : message,
          );
        } else if (error instanceof HttpErrorResponse && error.status === 409 && !isEditing) {
          this.idErrorMessage.set(message);
        } else {
          void Swal.fire({
            icon: 'error',
            title: 'No se pudo guardar',
            text: message,
            confirmButtonText: 'Entendido',
            background: 'var(--app-surface)',
            color: 'var(--app-text)',
            confirmButtonColor: 'var(--app-accent)',
          });
        }

        this.isSaving.set(false);
      },
    });
  }
}
