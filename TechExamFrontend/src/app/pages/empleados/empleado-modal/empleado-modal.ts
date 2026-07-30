import { Component, HostListener, inject, output, signal } from '@angular/core';
import { EmpleadosService } from '../../../../core/services/empleadosService';
import { Empleado } from '../../../models/empleado.model';

@Component({
  selector: 'app-empleado-modal',
  templateUrl: './empleado-modal.html',
  styleUrl: './empleado-modal.css',
})
export class EmpleadoModal {
  private readonly empleadosService = inject(EmpleadosService);

  readonly closed = output<void>();
  readonly saved = output<Empleado>();
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');
  readonly employeeId = signal('');
  readonly employeeName = signal('');
  readonly hasAttemptedSubmit = signal(false);

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

    if (!Number.isInteger(idEmpleado) || idEmpleado < 1 || !nombre || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.empleadosService
      .crearEmpleado({
        idEmpleado,
        nombre,
      })
      .subscribe({
        next: (employee) => {
          this.saved.emit(employee);
        },
        error: () => {
          this.errorMessage.set('No fue posible guardar el empleado. Intenta nuevamente.');
          this.isSaving.set(false);
        },
      });
  }
}
