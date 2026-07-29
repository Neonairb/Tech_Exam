using Microsoft.Data.SqlClient;

namespace TechExamBackend.Data
{
    public class SqlConnectionFactory :ISqlConnectionFactory
    {
        private readonly String _connectionString;

        // Obtener el string de coneccion de appsettings.json
        public SqlConnectionFactory(IConfiguration configuration)
        {
            _connectionString = 
                configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "No se encontró la cadena de conexión 'DefaultConnection'."
                );
        }

        public SqlConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
