
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimiento } from '../../app/models/movimiento.model';

@Service()
export class MovimientosService {
  	private readonly http = inject(HttpClient);

  	private readonly apiUrl = `${environment.apiUrl}/movimientos`; 

	obtenerTodos(): Observable<Movimiento[]>  {
		return this.http.get<Movimiento[]>(this.apiUrl);
	}

	obtenerPorId(idMovimiento: number): Observable<Movimiento> {
		return this.http.get<Movimiento>(`${this.apiUrl}/${idMovimiento}`);
	}

	obtenerPorEmpleado(idEmpleado: number): Observable<Movimiento[]> {
		return this.http.get<Movimiento[]>(`${this.apiUrl}/empleado/${idEmpleado}`);
	}
}
