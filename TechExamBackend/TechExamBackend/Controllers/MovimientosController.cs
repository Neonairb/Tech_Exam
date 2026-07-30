using Microsoft.AspNetCore.Mvc;
using TechExamBackend.Models;
using TechExamBackend.Models.Common;
using TechExamBackend.Repositories;

namespace TechExamBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimientosController : ControllerBase
    {
        private readonly IMovimientosRepository _movimientosRepository;

        public MovimientosController(IMovimientosRepository movimientosRepository)
        {
            _movimientosRepository = movimientosRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ResultadoPaginado<Movimiento>>> ObtenerTodos(
            CancellationToken cancellationToken,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10
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

            var movimientos = await _movimientosRepository.ObtenerTodosAsync(pageNumber, pageSize, cancellationToken);

            return Ok(movimientos);
        }

        [HttpGet("{idMovimiento:int}")]
        public async Task<ActionResult<Movimiento>> ObtenerPorId(
            int idMovimiento,
            CancellationToken cancellationToken
        )
        {
            var movimiento = await _movimientosRepository.ObtenerPorIdAsync(idMovimiento, cancellationToken);

            if (movimiento == null)
            {
                return NotFound(new
                {
                    mensaje = $"No se encontró el movimiento {idMovimiento}."
                });
            }

            return Ok(movimiento);
        }

        [HttpGet("empleado/{idEmpleado:int}")]
        public async Task<ActionResult<IReadOnlyCollection<Movimiento>>> ObtenerPorEmpleado(
            CancellationToken cancellationToken,
            int idEmpleado,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10
        )
        {
            if (pageNumber < 1)
            {
                return BadRequest(new
                {
                    mensaje = $"El número de página debe ser mayor que cero."
                });
            }
            if (pageSize < 1 || pageSize> 100)
            {
                return BadRequest(new
                {
                mensaje = $"El tamaño de página debe estar entre 1 y 100."
                });
            }
            var movimientos = await _movimientosRepository.ObtenerPorEmpleadoAsync(idEmpleado, pageNumber, pageSize, cancellationToken);

            return Ok(movimientos);
        }
    }
}
