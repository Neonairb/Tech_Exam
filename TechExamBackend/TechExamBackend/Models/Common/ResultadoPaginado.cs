namespace TechExamBackend.Models.Common
{
    public class ResultadoPaginado<T>
    {
        public IReadOnlyCollection<T> Datos { get; init; } = [];
        public int TotalRegistros { get; init; }
        public int? TotalActivos { get; init; }
        public int? TotalInactivos { get; init; }
    }
}
