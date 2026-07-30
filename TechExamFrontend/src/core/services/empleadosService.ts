import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { ActualizarEmpleadoRequest, CrearEmpleadoRequest, Empleado } from '../../app/models/empleado.model';
import { ResultadoPaginado } from '../../app/models/resultado-paginado.model';

@Service()
export class EmpleadosService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/Empleados`;

    obtenerTodos(pageNumber = 1, pageSize = 10): Observable<ResultadoPaginado<Empleado>> {
        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize);

        return this.http.get<ResultadoPaginado<Empleado>>(this.apiUrl, { params });
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
