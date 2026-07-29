using Microsoft.Data.SqlClient;
using System.Data;
using TechExamBackend.Data;
using TechExamBackend.Models;

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

        public async Task<IReadOnlyCollection<Movimiento>> ObtenerTodosAsync(CancellationToken cancellationToken = default)
        {
            var movimientos = new List<Movimiento>();

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
                movimientos.Add(MapearMovimiento(reader));
            }

            return movimientos;
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
        public async Task<IReadOnlyCollection<Movimiento>> ObtenerPorEmpleadoAsync(
            int idEmpleado,
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

            await using var reader = await context.Command.ExecuteReaderAsync(
                cancellationToken
            );

            while (await reader.ReadAsync(cancellationToken))
            {
                movimientos.Add(MapearMovimiento(reader));
            }

            return movimientos;
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
