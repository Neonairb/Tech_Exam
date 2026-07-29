using Microsoft.AspNetCore.Mvc;
using TechExamBackend.Models;
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
        public async Task<ActionResult<IReadOnlyCollection<Movimiento>>> ObtenerTodos(
            CancellationToken cancellationToken
        )
        {
            var movimientos = await _movimientosRepository.ObtenerTodosAsync(cancellationToken);

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
            int idEmpleado,
            CancellationToken cancellationToken
        )
        {
            var movimientos = await _movimientosRepository.ObtenerPorEmpleadoAsync(idEmpleado, cancellationToken);

            return Ok(movimientos);
        }
    }
}
