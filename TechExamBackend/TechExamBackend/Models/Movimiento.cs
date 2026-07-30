namespace TechExamBackend.Models
{
    public class Movimiento
    {
        public int IdMovimiento { get; set; }

        public int IdEmpleado { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string TipoMovimiento { get; set; } = string.Empty;

        public DateTime FechaMovimiento { get; set; }
    }
}
