import { Component, inject, OnInit, signal } from '@angular/core';
import { EmpleadosService } from '../../../../core/services/empleadosService';
import { Empleado } from '../../../models/empleado.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-empleados-list',
  imports: [DatePipe],
  templateUrl: './empleados-list.html',
  styleUrl: './empleados-list.css',
})
export class EmpleadosList implements OnInit {
  private readonly empleadosService = inject(EmpleadosService);
  
  readonly empleados = signal<Empleado[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit() {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.empleadosService.obtenerTodos().subscribe({
      next: (empleados) => {
        this.empleados.set(empleados);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar los empleados');
        this.isLoading.set(false);
      }
    });
  }
}
