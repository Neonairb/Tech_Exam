import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { EmpleadosService } from '../../../../core/services/empleadosService';
import { Empleado } from '../../../models/empleado.model';

@Component({
  selector: 'app-empleados-list',
  imports: [JsonPipe],
  templateUrl: './empleados-list.html',
  styleUrl: './empleados-list.css',
})
export class EmpleadosList implements OnInit {
  private readonly empleadosService = inject(EmpleadosService);
  
  empleados: Empleado[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.isLoading = true;
    this.errorMessage = '';

    this.empleadosService.obtenerTodos().subscribe({
      next: (empleados) => {
        this.empleados = empleados;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los empleados';
        this.isLoading = false;
      }
    });
  }
}
