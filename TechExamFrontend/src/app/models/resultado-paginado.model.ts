export interface ResultadoPaginado<T> {
  datos: T[];
  totalRegistros: number;
  totalActivos?: number | null;
  totalInactivos?: number | null;
}
