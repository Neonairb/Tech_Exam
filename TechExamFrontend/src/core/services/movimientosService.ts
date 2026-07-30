
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Service()
export class MovimientosService {
  	private readonly http = inject(HttpClient);

  	private readonly apiUrl = `${environment.apiUrl}/movimientos`; 

	obtenerTodos() {
		return this.http.get(this.apiUrl);
	}

	obtenerPorId(idMovimiento: number) {
		return this.http.get(`${this.apiUrl}/${idMovimiento}`);
	}

	obtenerPorEmpleado(idEmpleado: number) {
		return this.http.get(`${this.apiUrl}/empleado/${idEmpleado}`);
	}
}
