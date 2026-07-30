import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { ActualizarEmpleadoRequest, CrearEmpleadoRequest, Empleado } from '../../app/models/empleado.model';

@Service()
export class EmpleadosService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/Empleados`;

    obtenerTodos(): Observable<Empleado[]> {
        return this.http.get<Empleado[]>(this.apiUrl);
    }

    obtenerPorId(idEmpleado: number): Observable<Empleado> {
        return this.http.get<Empleado>(`${this.apiUrl}/${idEmpleado}`);
    }

    crearEmpleado(empleado: CrearEmpleadoRequest): Observable<Empleado> {
        return this.http.post<Empleado>(this.apiUrl, empleado);
    }

    actualizarEmpleado(idEmpleado: number, empleado: ActualizarEmpleadoRequest): Observable<Empleado> {
        return this.http.put<Empleado>(`${this.apiUrl}/${idEmpleado}`, empleado);
    }

    darDeBajaEmpleado(idEmpleado: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${idEmpleado}`);
    }
}
