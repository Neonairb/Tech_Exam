using Microsoft.AspNetCore.Mvc;
using TechExamBackend.Models;
using TechExamBackend.Repositories;
using TechExamBackend.Dtos;
using Microsoft.Data.SqlClient;

namespace TechExamBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadosController : ControllerBase
    {
        private readonly IEmpleadoRepository _empleadoRepository;

        public EmpleadosController(
            IEmpleadoRepository empleadoRepository
        )
        {
            _empleadoRepository = empleadoRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyCollection<Empleado>>> ObtenerTodos(
            CancellationToken cancellationToken
        )
        {
            var empleados = await _empleadoRepository.ObtenerTodosAsync(cancellationToken);

            return Ok(empleados);
        }

        [HttpGet("{idEmpleado:int}")]
        public async Task<ActionResult<Empleado>> ObtenerPorId(
            int idEmpleado,
            CancellationToken cancellationToken
        )
        {
            var empleado = await _empleadoRepository.ObtenerPorIdAsync(idEmpleado, cancellationToken);

            if (empleado == null)
            {
                return NotFound(new
                {
                    mensaje = $"No se encontró el empleado {idEmpleado}."
                });
            }

            return Ok(empleado);
        }

        [HttpPost]
        public async Task<ActionResult<Empleado>> Crear(
            [FromBody] CrearEmpleadoRequest request,
            CancellationToken cancellationToken
        )
        {
            try
            {
                var empleado = await _empleadoRepository.CrearAsync(
                    request,
                    cancellationToken
                );

                return CreatedAtAction(
                    nameof(ObtenerPorId),
                    new { idEmpleado = empleado.IdEmpleado },
                    empleado
                );
            }
            catch (SqlException exception) when (
                exception.Number is 2627 or 2601 or 50004
            )
            {
                return Conflict(new
                {
                    mensaje = "Ya existe un empleado con ese identificador."
                });
            }
        }

        [HttpPut("{idEmpleado:int}")]
        public async Task<ActionResult<Empleado>> Actualizar(
            int idEmpleado,
            [FromBody] ActualizarEmpleadoRequest request,
            CancellationToken cancellationToken
        )
        {
            try
            {
                var empleado = await _empleadoRepository.ActualizarAsync(
                    idEmpleado,
                    request,
                    cancellationToken
                );

                return Ok(empleado);
            }
            catch (SqlException exception) when (exception.Number == 50001)
            {
                return NotFound(new
                {
                    mensaje = exception.Message
                });
            }
        }

        [HttpDelete("{idEmpleado:int}")]
        public async Task<IActionResult> DarDeBaja(
            int idEmpleado,
            CancellationToken cancellationToken
        )
        {
            try
            {
                await _empleadoRepository.DarDeBajaAsync(
                    idEmpleado,
                    cancellationToken
                );

                return NoContent();
            }
            catch (SqlException exception) when (exception.Number == 50002)
            {
                return NotFound(new
                {
                    mensaje = exception.Message
                });
            }
            catch (SqlException exception) when (exception.Number == 50005)
            {
                return Conflict(new
                {
                    mensaje = exception.Message
                });
            }
        }
    }
}
