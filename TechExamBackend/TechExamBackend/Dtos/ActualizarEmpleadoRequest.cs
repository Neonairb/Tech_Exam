using System.ComponentModel.DataAnnotations;

namespace TechExamBackend.Dtos
{
    public class ActualizarEmpleadoRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(
            50,
            MinimumLength = 1,
            ErrorMessage = "El nombre debe tener entre 1 y 50 caracteres."
        )]
        public string Nombre { get; set; } = string.Empty;
    }
}
