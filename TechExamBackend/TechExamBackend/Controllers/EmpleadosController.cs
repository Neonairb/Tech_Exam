using Microsoft.AspNetCore.Mvc;
using TechExamBackend.Models;
using TechExamBackend.Repositories;
using TechExamBackend.Dtos;
using Microsoft.Data.SqlClient;
using TechExamBackend.Models.Common;

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
        public async Task<ActionResult<ResultadoPaginado<Empleado>>> ObtenerTodos(
            CancellationToken cancellationToken,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? query = null
        )
        {
            if (pageNumber < 1)
            {
                return BadRequest(new
                {
                    mensaje = $"El número de página debe ser mayor que cero."
                });
            }
            if (pageSize < 1 || pageSize > 100)
            {
                return BadRequest(new
                {
                    mensaje = $"El tamaño de página debe estar entre 1 y 100."
                });
            }
            if (query?.Length > 20)
            {
                return BadRequest(new
                {
                    mensaje = $"La búsqueda no puede tener más de 20 caracteres."
                });
            }

            var resultadoPaginado = await _empleadoRepository.ObtenerTodosAsync(pageNumber, pageSize, query, cancellationToken);

            return Ok(resultadoPaginado);
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
