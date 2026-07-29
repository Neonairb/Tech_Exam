using TechExamBackend.Dtos;
using TechExamBackend.Models;

namespace TechExamBackend.Repositories
{
    public interface IEmpleadoRepository
    {
        Task<IReadOnlyCollection<Empleado>> ObtenerTodosAsync(
            CancellationToken cancellationToken = default
        );

        Task<Empleado?> ObtenerPorIdAsync(
            int idEmpleado,
            CancellationToken cancellationToken = default
        );
        Task<Empleado> CrearAsync(
            CrearEmpleadoRequest request,
            CancellationToken cancellationToken = default
        );

        Task<Empleado> ActualizarAsync(
            int idEmpleado,
            ActualizarEmpleadoRequest request,
            CancellationToken cancellationToken = default
        );

        Task DarDeBajaAsync(
            int idEmpleado,
            CancellationToken cancellationToken = default
        );
    }
}
