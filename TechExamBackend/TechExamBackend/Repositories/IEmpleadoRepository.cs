using TechExamBackend.Dtos;
using TechExamBackend.Models;
using TechExamBackend.Models.Common;

namespace TechExamBackend.Repositories
{
    public interface IEmpleadoRepository
    {
        Task<ResultadoPaginado<Empleado>> ObtenerTodosAsync(
            int pageNumber = 1,
            int pageSize = 10,
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
