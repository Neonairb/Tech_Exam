namespace TechExamBackend.Models
{
    public class Empleado
    {
        public int IdEmpleado { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public bool Activo { get; set; }

        public DateTime FechaAlta { get; set; }

        public DateTime? FechaModificacion { get; set; }
    }
}
