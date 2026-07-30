using TechExamBackend.Models;
using TechExamBackend.Models.Common;

namespace TechExamBackend.Repositories
{
    public interface IMovimientosRepository
    {
        Task<ResultadoPaginado<Movimiento>> ObtenerTodosAsync(
            int pageNumber = 1,
            int pageSize = 10,
            CancellationToken cancellationToken = default
        );
        Task<Movimiento?> ObtenerPorIdAsync(
            int idMovimiento,
            CancellationToken cancellationToken = default
        );
        Task<ResultadoPaginado<Movimiento>> ObtenerPorEmpleadoAsync(
            int idEmpleado,
            int pageNumber = 1,
            int pageSize = 10,
            CancellationToken cancellationToken = default
        );
    }
}
