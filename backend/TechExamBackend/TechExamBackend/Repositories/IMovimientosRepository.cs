using TechExamBackend.Models;

namespace TechExamBackend.Repositories
{
    public interface IMovimientosRepository
    {
        Task<IReadOnlyCollection<Movimiento>> ObtenerTodosAsync(
            CancellationToken cancellationToken = default
        );
        Task<Movimiento?> ObtenerPorIdAsync(
            int idMovimiento,
            CancellationToken cancellationToken = default
        );
        Task<IReadOnlyCollection<Movimiento>> ObtenerPorEmpleadoAsync(
            int idEmpleado,
            CancellationToken cancellationToken = default
        );
    }
}
