
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimiento } from '../../app/models/movimiento.model';
import { ResultadoPaginado } from '../../app/models/resultado-paginado.model';

@Service()
export class MovimientosService {
  	private readonly http = inject(HttpClient);

  	private readonly apiUrl = `${environment.apiUrl}/movimientos`; 

	obtenerTodos(pageNumber = 1, pageSize = 10): Observable<ResultadoPaginado<Movimiento>>  {
		const params = new HttpParams()
			.set('pageNumber', pageNumber)
			.set('pageSize', pageSize);

		return this.http.get<ResultadoPaginado<Movimiento>>(this.apiUrl, { params });
	}

	obtenerPorId(idMovimiento: number): Observable<Movimiento> {
		return this.http.get<Movimiento>(`${this.apiUrl}/${idMovimiento}`);
	}

	obtenerPorEmpleado(
		idEmpleado: number,
		pageNumber = 1,
		pageSize = 10,
	): Observable<ResultadoPaginado<Movimiento>> {
		const params = new HttpParams()
			.set('pageNumber', pageNumber)
			.set('pageSize', pageSize);

		return this.http.get<ResultadoPaginado<Movimiento>>(
			`${this.apiUrl}/empleado/${idEmpleado}`,
			{ params },
		);
	}
}
