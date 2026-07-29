using Microsoft.Data.SqlClient;
using System.Data;

namespace TechExamBackend.Data;

// Clase para ahorrar procedimiento de coneccion
internal sealed class SqlCommandContext : IAsyncDisposable
{
    public SqlConnection Connection { get; }

    public SqlCommand Command { get; }

    private SqlCommandContext(
        SqlConnection connection,
        SqlCommand command
    )
    {
        Connection = connection;
        Command = command;
    }

    public static async Task<SqlCommandContext> CreateAsync(
        ISqlConnectionFactory connectionFactory,
        string storedProcedure,
        CancellationToken cancellationToken = default
    )
    {
        var connection = connectionFactory.CreateConnection();

        var command = new SqlCommand(
            storedProcedure,
            connection
        )
        {
            CommandType = CommandType.StoredProcedure
        };

        try
        {
            await connection.OpenAsync(cancellationToken);

            return new SqlCommandContext(
                connection,
                command
            );
        }
        catch
        {
            await command.DisposeAsync();
            await connection.DisposeAsync();

            throw;
        }
    }

    public void AddParameter(SqlParameter parameter)
    {
        Command.Parameters.Add(parameter);
    }

    public async ValueTask DisposeAsync()
    {
        await Command.DisposeAsync();
        await Connection.DisposeAsync();
    }
}
