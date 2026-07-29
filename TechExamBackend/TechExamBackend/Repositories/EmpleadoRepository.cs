using Microsoft.Data.SqlClient;
using TechExamBackend.Data;
using System.Data;
using TechExamBackend.Dtos;
using TechExamBackend.Models;

namespace TechExamBackend.Repositories
{
    public class EmpleadoRepository : IEmpleadoRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;
        public EmpleadoRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        private static class Sp
        {
            public const string ObtenerTodos =
                "sp_Empleados_ObtenerTodos";

            public const string ObtenerPorId =
                "sp_Empleados_ObtenerPorId";

            public const string Crear =
                "sp_Empleados_Crear";

            public const string Actualizar =
                "sp_Empleados_Actualizar";

            public const string DarDeBaja =
                "sp_Empleados_DarDeBaja";
        }

        public async Task<IReadOnlyCollection<Empleado>> ObtenerTodosAsync(CancellationToken cancellationToken = default)
        {
            var empleados = new List<Empleado>();

            await using var context = await SqlCommandContext.CreateAsync(
                _connectionFactory,
                Sp.ObtenerTodos,
                cancellationToken
            );

            await using var reader = await context.Command.ExecuteReaderAsync(
                cancellationToken
            );

            while (await reader.ReadAsync(cancellationToken))
            {
                empleados.Add(MapearEmpleado(reader));
            }

            return empleados;
        }
        public async Task<Empleado?> ObtenerPorIdAsync(int idEmpleado, CancellationToken cancellationToken = default)
        {
            await using var context = await SqlCommandContext.CreateAsync(
                _connectionFactory,
                Sp.ObtenerPorId,
                cancellationToken
            );

            context.AddParameter(
                new SqlParameter("@IdEmpleado", SqlDbType.Int)
                {
                    Value = idEmpleado
                }
            );

            await using var reader = await context.Command.ExecuteReaderAsync(
                CommandBehavior.SingleRow,
                cancellationToken
            );

            if (!await reader.ReadAsync(cancellationToken))
            {
                return null;
            }

            return MapearEmpleado(reader);
        }
        public async Task<Empleado> CrearAsync(CrearEmpleadoRequest request, CancellationToken cancellationToken = default)
        {
            await using var context = await SqlCommandContext.CreateAsync(
                _connectionFactory,
                Sp.Crear,
                cancellationToken
            );

            context.AddParameter(
                new SqlParameter("@IdEmpleado", SqlDbType.Int)
                {
                    Value = request.IdEmpleado
                }
            );

            context.AddParameter(
                new SqlParameter("@Nombre", SqlDbType.NVarChar, 50)
                {
                    Value = request.Nombre.Trim()
                }
            );

            await context.Command.ExecuteNonQueryAsync(cancellationToken);

            var empleado = await ObtenerPorIdAsync(
                request.IdEmpleado,
                cancellationToken
            );

            return empleado
                ?? throw new InvalidOperationException(
                    "El empleado fue creado, pero no pudo recuperarse."
                );
        }
        public async Task<Empleado> ActualizarAsync(int idEmpleado, ActualizarEmpleadoRequest request, CancellationToken cancellationToken = default)
        {
            await using var context = await SqlCommandContext.CreateAsync(
                _connectionFactory,
                Sp.Actualizar,
                cancellationToken
            );

            context.AddParameter(
                new SqlParameter("@IdEmpleado", SqlDbType.Int)
                {
                    Value = idEmpleado
                }
            );

            context.AddParameter(
                new SqlParameter("@Nombre", SqlDbType.NVarChar, 50)
                {
                    Value = request.Nombre.Trim()
                }
            );

            await context.Command.ExecuteNonQueryAsync(cancellationToken);

            var empleado = await ObtenerPorIdAsync(
                idEmpleado,
                cancellationToken
            );

            return empleado
                ?? throw new InvalidOperationException(
                    "El empleado fue actualizado, pero no pudo recuperarse."
                );
        }
        public async Task DarDeBajaAsync(int idEmpleado, CancellationToken cancellationToken = default)
        {
            await using var context = await SqlCommandContext.CreateAsync(
                _connectionFactory,
                Sp.DarDeBaja,
                cancellationToken
            );

            context.AddParameter(
                new SqlParameter("@IdEmpleado", SqlDbType.Int)
                {
                    Value = idEmpleado
                }
            );

            await context.Command.ExecuteNonQueryAsync(cancellationToken);
        }

        private static Empleado MapearEmpleado(SqlDataReader reader)
        {
            return new Empleado
            {
                IdEmpleado = reader.GetInt32(
                    reader.GetOrdinal("IdEmpleado")
                ),

                Nombre = reader.GetString(
                    reader.GetOrdinal("Nombre")
                ),

                Activo = reader.GetBoolean(
                    reader.GetOrdinal("Activo")
                ),

                FechaAlta = reader.GetDateTime(
                    reader.GetOrdinal("FechaAlta")
                ),

                FechaModificacion = reader.IsDBNull(
                    reader.GetOrdinal("FechaModificacion")
                )
                    ? null
                    : reader.GetDateTime(
                        reader.GetOrdinal("FechaModificacion")
                    )
            };
        }
    }
}
