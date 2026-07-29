using Microsoft.Data.SqlClient;

namespace TechExamBackend.Data
{
    public interface ISqlConnectionFactory
    {
        SqlConnection CreateConnection();
    }
}
