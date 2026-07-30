using System.ComponentModel.DataAnnotations;

namespace TechExamBackend.Dtos
{
    public class ActualizarEmpleadoRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(
            20,
            MinimumLength = 1,
            ErrorMessage = "El nombre debe tener entre 1 y 20 caracteres."
        )]
        public string Nombre { get; set; } = string.Empty;
    }
}
