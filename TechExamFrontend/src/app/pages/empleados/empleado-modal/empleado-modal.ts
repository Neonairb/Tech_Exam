import { Component, effect, HostListener, inject, input, output, signal } from '@angular/core';
import { EmpleadosService } from '../../../../core/services/empleadosService';
import { Empleado } from '../../../models/empleado.model';

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
  readonly employeeId = signal('');
  readonly employeeName = signal('');
  readonly hasAttemptedSubmit = signal(false);

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
  }

  updateEmployeeName(event: Event): void {
    this.employeeName.set((event.target as HTMLInputElement).value);
  }

  save(event: SubmitEvent): void {
    event.preventDefault();
    this.hasAttemptedSubmit.set(true);

    const idEmpleado = Number(this.employeeId());
    const nombre = this.employeeName().trim();
    const isEditing = this.mode() === 'edit';

    if (
      (!isEditing && (!Number.isInteger(idEmpleado) || idEmpleado < 1)) ||
      !nombre ||
      this.isSaving()
    ) {
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
      },
      error: () => {
        this.errorMessage.set(
          isEditing
            ? 'No fue posible actualizar el empleado. Intenta nuevamente.'
            : 'No fue posible guardar el empleado. Intenta nuevamente.',
        );
        this.isSaving.set(false);
      },
    });
  }
}
