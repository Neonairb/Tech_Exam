export interface Empleado {
  idEmpleado: number;
  nombre: string;
  activo: boolean;
  fechaAlta: string;
  fechaModificacion: string | null;
}

export interface CrearEmpleadoRequest {
  idEmpleado: number;
  nombre: string;
}

export interface ActualizarEmpleadoRequest {
  nombre: string;
}