using Microsoft.Data.SqlClient;
using System.Data;
using TechExamBackend.Data;
using TechExamBackend.Models;
using TechExamBackend.Models.Common;

namespace TechExamBackend.Repositories
{
    public class MovimientosRepository : IMovimientosRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;
        public MovimientosRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        private static class Sp
        {
            public const string ObtenerTodos =
                "sp_Movimientos_ObtenerTodos";

            public const string ObtenerPorId =
                "sp_Movimientos_ObtenerPorId";

            public const string ObtenerPorEmpleado =
                "sp_Movimientos_ObtenerPorEmpleado";
        }

        public async Task<ResultadoPaginado<Movimiento>> ObtenerTodosAsync(
            int pageNumber = 1,
            int pageSize = 10,
            CancellationToken cancellationToken = default
        )
        {
            var movimientos = new List<Movimiento>();

            await using var context = await SqlCommandContext.CreateAsync(
                _connectionFactory,
                Sp.ObtenerTodos,
                cancellationToken
            );

            context.AddParameter(
                new SqlParameter("@PageNumber", SqlDbType.Int)
                {
                    Value = pageNumber
                }
            );

            context.AddParameter(
                new SqlParameter("@PageSize", SqlDbType.Int)
                {
                    Value = pageSize
                }
            );

            await using var reader = await context.Command.ExecuteReaderAsync(
                cancellationToken
            );

            while (await reader.ReadAsync(cancellationToken))
            {
                movimientos.Add(MapearMovimiento(reader));
            }

            var totalRegistros = 0;

            if (
                await reader.NextResultAsync(cancellationToken)
                && await reader.ReadAsync(cancellationToken)
            )
            {
                totalRegistros = reader.GetInt32(
                    reader.GetOrdinal("TotalRegistros")
                );
            }

            return new ResultadoPaginado<Movimiento>
            {
                Datos = movimientos,
                TotalRegistros = totalRegistros
            };
        }
        public async Task<Movimiento?> ObtenerPorIdAsync(
            int idMovimiento,
            CancellationToken cancellationToken = default
        )
        {
            await using var context = await SqlCommandContext.CreateAsync(
                _connectionFactory,
                Sp.ObtenerPorId,
                cancellationToken
            );

            context.AddParameter(
                new SqlParameter("@IdMovimiento", SqlDbType.Int)
                {
                    Value = idMovimiento
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

            return MapearMovimiento(reader);
        }
        public async Task<ResultadoPaginado<Movimiento>> ObtenerPorEmpleadoAsync(
            int idEmpleado,
            int pageNumber = 1,
            int pageSize = 10,
            CancellationToken cancellationToken = default
        )
        {
            var movimientos = new List<Movimiento>();

            await using var context = await SqlCommandContext.CreateAsync(
                _connectionFactory,
                Sp.ObtenerPorEmpleado,
                cancellationToken
            );

            context.AddParameter(
                new SqlParameter("@IdEmpleado", SqlDbType.Int)
                {
                    Value = idEmpleado
                }
            );

            context.AddParameter(
                new SqlParameter("@PageNumber", SqlDbType.Int)
                {
                    Value = pageNumber
                }
            );

            context.AddParameter(
                new SqlParameter("@PageSize", SqlDbType.Int)
                {
                    Value = pageSize
                }
            );

            await using var reader = await context.Command.ExecuteReaderAsync(
                cancellationToken
            );

            while (await reader.ReadAsync(cancellationToken))
            {
                movimientos.Add(MapearMovimiento(reader));
            }

            var totalRegistros = 0;

            if (
                await reader.NextResultAsync(cancellationToken)
                && await reader.ReadAsync(cancellationToken)
            )
            {
                totalRegistros = reader.GetInt32(
                    reader.GetOrdinal("TotalRegistros")
                );
            }

            return new ResultadoPaginado<Movimiento>
            {
                Datos = movimientos,
                TotalRegistros = totalRegistros
            };
        }
        private static Movimiento MapearMovimiento(SqlDataReader reader)
        {
            return new Movimiento
            {
                IdMovimiento = reader.GetInt32(
                    reader.GetOrdinal("IdMovimiento")
                ),

                IdEmpleado = reader.GetInt32(
                    reader.GetOrdinal("IdEmpleado")
                ),

                Nombre = reader.GetString(
                    reader.GetOrdinal("Nombre")
                ),

                TipoMovimiento = reader.GetString(
                    reader.GetOrdinal("TipoMovimiento")
                ),

                FechaMovimiento = reader.GetDateTime(
                    reader.GetOrdinal("FechaMovimiento")
                ),
            };
        }
    }
}
