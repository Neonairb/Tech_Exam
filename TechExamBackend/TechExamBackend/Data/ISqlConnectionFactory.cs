using Microsoft.Data.SqlClient;

namespace TechExamBackend.Data
{
    // Usado para comunicar que se necesita algo capaz de crear conexiones.
    public interface ISqlConnectionFactory
    {
        SqlConnection CreateConnection();
    }
}
