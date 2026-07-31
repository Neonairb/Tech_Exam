USE EXAMEN;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRY
    BEGIN TRANSACTION;

    DECLARE @PrimerId INT = 900001;
    DECLARE @UltimoId INT = 900050;
    DECLARE @Ahora DATETIME2 = SYSDATETIME();

    -- La semilla es repetible y solo reemplaza sus propios registros.
    DELETE FROM Movimientos
    WHERE IdEmpleado BETWEEN @PrimerId AND @UltimoId;

    DELETE FROM Empleados
    WHERE IdEmpleado BETWEEN @PrimerId AND @UltimoId;

    INSERT INTO Empleados
    (
        IdEmpleado,
        Nombre,
        Activo,
        FechaAlta,
        FechaModificacion
    )
    VALUES
        (900001, N'Ana',                  1, DATEADD(DAY, -120, @Ahora), DATEADD(DAY, -2, @Ahora)),
        (900002, N'Luis Pérez',           1, DATEADD(DAY, -119, @Ahora), NULL),
        (900003, N'María José',           1, DATEADD(DAY, -118, @Ahora), DATEADD(DAY, -20, @Ahora)),
        (900004, N'José-Luis',            0, DATEADD(DAY, -117, @Ahora), DATEADD(DAY, -5, @Ahora)),
        (900005, N'O''Connor',            1, DATEADD(DAY, -116, @Ahora), NULL),
        (900006, N'123 Prueba',           1, DATEADD(DAY, -115, @Ahora), DATEADD(DAY, -18, @Ahora)),
        (900007, N'Ángel',                1, DATEADD(DAY, -114, @Ahora), NULL),
        (900008, N'Zoë',                  0, DATEADD(DAY, -113, @Ahora), DATEADD(DAY, -8, @Ahora)),
        (900009, N'Renée',                1, DATEADD(DAY, -112, @Ahora), DATEADD(DAY, -16, @Ahora)),
        (900010, N'Óscar',                1, DATEADD(DAY, -111, @Ahora), NULL),
        (900011, N'Empleado 011',         1, DATEADD(DAY, -110, @Ahora), NULL),
        (900012, N'Empleado 012',         0, DATEADD(DAY, -109, @Ahora), DATEADD(DAY, -12, @Ahora)),
        (900013, N'Empleado 013',         1, DATEADD(DAY, -108, @Ahora), NULL),
        (900014, N'Empleado 014',         1, DATEADD(DAY, -107, @Ahora), NULL),
        (900015, N'Empleado 015',         1, DATEADD(DAY, -106, @Ahora), DATEADD(DAY, -14, @Ahora)),
        (900016, N'Empleado 016',         0, DATEADD(DAY, -105, @Ahora), DATEADD(DAY, -15, @Ahora)),
        (900017, N'Empleado 017',         1, DATEADD(DAY, -104, @Ahora), NULL),
        (900018, N'Empleado 018',         1, DATEADD(DAY, -103, @Ahora), DATEADD(DAY, -13, @Ahora)),
        (900019, N'Empleado 019',         1, DATEADD(DAY, -102, @Ahora), NULL),
        (900020, N'Empleado 020',         0, DATEADD(DAY, -101, @Ahora), DATEADD(DAY, -20, @Ahora)),
        (900021, N'Empleado 021',         1, DATEADD(DAY, -100, @Ahora), DATEADD(DAY, -11, @Ahora)),
        (900022, N'Empleado 022',         1, DATEADD(DAY, -99, @Ahora), NULL),
        (900023, N'Empleado 023',         1, DATEADD(DAY, -98, @Ahora), NULL),
        (900024, N'Empleado 024',         0, DATEADD(DAY, -97, @Ahora), DATEADD(DAY, -25, @Ahora)),
        (900025, N'Empleado 025',         1, DATEADD(DAY, -96, @Ahora), NULL),
        (900026, N'Empleado 026',         1, DATEADD(DAY, -95, @Ahora), NULL),
        (900027, N'Empleado 027',         1, DATEADD(DAY, -94, @Ahora), DATEADD(DAY, -9, @Ahora)),
        (900028, N'Empleado 028',         0, DATEADD(DAY, -93, @Ahora), DATEADD(DAY, -30, @Ahora)),
        (900029, N'Empleado 029',         1, DATEADD(DAY, -92, @Ahora), NULL),
        (900030, N'Empleado 030',         1, DATEADD(DAY, -91, @Ahora), DATEADD(DAY, -7, @Ahora)),
        (900031, N'Empleado 031',         1, DATEADD(DAY, -90, @Ahora), NULL),
        (900032, N'Empleado 032',         0, DATEADD(DAY, -89, @Ahora), DATEADD(DAY, -35, @Ahora)),
        (900033, N'Empleado 033',         1, DATEADD(DAY, -88, @Ahora), DATEADD(DAY, -6, @Ahora)),
        (900034, N'Empleado 034',         1, DATEADD(DAY, -87, @Ahora), NULL),
        (900035, N'Empleado 035',         1, DATEADD(DAY, -86, @Ahora), NULL),
        (900036, N'Empleado 036',         0, DATEADD(DAY, -85, @Ahora), DATEADD(DAY, -40, @Ahora)),
        (900037, N'Empleado 037',         1, DATEADD(DAY, -84, @Ahora), NULL),
        (900038, N'Empleado 038',         1, DATEADD(DAY, -83, @Ahora), NULL),
        (900039, N'Empleado 039',         1, DATEADD(DAY, -82, @Ahora), DATEADD(DAY, -4, @Ahora)),
        (900040, N'Empleado 040',         0, DATEADD(DAY, -81, @Ahora), DATEADD(DAY, -45, @Ahora)),
        (900041, N'Empleado 041',         1, DATEADD(DAY, -80, @Ahora), NULL),
        (900042, N'Empleado 042',         1, DATEADD(DAY, -79, @Ahora), DATEADD(DAY, -3, @Ahora)),
        (900043, N'Empleado 043',         1, DATEADD(DAY, -78, @Ahora), NULL),
        (900044, N'Empleado 044',         0, DATEADD(DAY, -77, @Ahora), DATEADD(DAY, -50, @Ahora)),
        (900045, N'Empleado 045',         1, DATEADD(DAY, -76, @Ahora), DATEADD(DAY, -2, @Ahora)),
        (900046, N'Empleado 046',         1, DATEADD(DAY, -75, @Ahora), NULL),
        (900047, N'Empleado 047',         1, DATEADD(DAY, -74, @Ahora), NULL),
        (900048, N'Baja Depurable',       0, DATEADD(MONTH, -8, @Ahora), DATEADD(MONTH, -4, @Ahora)),
        (900049, N'NombreExacto20CharsX', 1, DATEADD(DAY, -2, @Ahora), NULL),
        (900050, N'Sin Movimientos',      1, DATEADD(DAY, -1, @Ahora), NULL);

    -- Todos menos 900050 tienen un movimiento de alta.
    INSERT INTO Movimientos
    (
        IdEmpleado,
        TipoMovimiento,
        FechaMovimiento
    )
    SELECT
        e.IdEmpleado,
        N'Alta',
        e.FechaAlta
    FROM Empleados AS e
    WHERE e.IdEmpleado BETWEEN @PrimerId AND @UltimoId
      AND e.IdEmpleado <> 900050;

    -- Historial de cambios para probar los tres tipos de movimiento.
    INSERT INTO Movimientos
    (
        IdEmpleado,
        TipoMovimiento,
        FechaMovimiento
    )
    SELECT
        e.IdEmpleado,
        N'Cambio',
        DATEADD(DAY, -10, @Ahora)
    FROM Empleados AS e
    WHERE e.IdEmpleado BETWEEN @PrimerId AND @UltimoId
      AND e.IdEmpleado % 3 = 0
      AND e.IdEmpleado <> 900048;

    -- Más de una página de movimientos para un solo empleado.
    INSERT INTO Movimientos
    (
        IdEmpleado,
        TipoMovimiento,
        FechaMovimiento
    )
    SELECT
        900001,
        N'Cambio',
        DATEADD(HOUR, -v.Numero, @Ahora)
    FROM
    (
        VALUES (1), (2), (3), (4), (5), (6),
               (7), (8), (9), (10), (11), (12)
    ) AS v(Numero);

    -- Cada empleado inactivo recibe su baja como último movimiento.
    INSERT INTO Movimientos
    (
        IdEmpleado,
        TipoMovimiento,
        FechaMovimiento
    )
    SELECT
        e.IdEmpleado,
        N'Baja',
        e.FechaModificacion
    FROM Empleados AS e
    WHERE e.IdEmpleado BETWEEN @PrimerId AND @UltimoId
      AND e.Activo = 0;

    -- Aserciones de la semilla y sus casos límite.
    IF (
        SELECT COUNT(*)
        FROM Empleados
        WHERE IdEmpleado BETWEEN @PrimerId AND @UltimoId
    ) <> 50
        THROW 51000, 'La semilla debe crear exactamente 50 empleados.', 1;

    IF EXISTS
    (
        SELECT 1
        FROM Empleados
        WHERE IdEmpleado BETWEEN @PrimerId AND @UltimoId
          AND LEN(Nombre) > 20
    )
        THROW 51001, 'La semilla contiene un nombre mayor a 20 caracteres.', 1;

    IF LEN((SELECT Nombre FROM Empleados WHERE IdEmpleado = 900049)) <> 20
        THROW 51002, 'No se creó el caso límite de nombre con 20 caracteres.', 1;

    IF EXISTS (SELECT 1 FROM Movimientos WHERE IdEmpleado = 900050)
        THROW 51003, 'El empleado sin movimientos recibió historial inesperado.', 1;

    IF (
        SELECT COUNT(*)
        FROM Movimientos
        WHERE IdEmpleado = 900001
    ) <= 10
        THROW 51004, 'No se creó el caso de paginación por empleado.', 1;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Empleados
        WHERE IdEmpleado BETWEEN @PrimerId AND @UltimoId
          AND Activo = 0
    )
        THROW 51005, 'La semilla debe incluir empleados inactivos.', 1;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Movimientos
        WHERE IdEmpleado BETWEEN @PrimerId AND @UltimoId
          AND TipoMovimiento = N'Baja'
    )
        THROW 51006, 'La semilla debe incluir movimientos de baja.', 1;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
GO

-- Resumen visible para comprobar paginación, estados y volumen.
SELECT
    COUNT(*) AS EmpleadosSemilla,
    SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) AS Activos,
    SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) AS Inactivos
FROM Empleados
WHERE IdEmpleado BETWEEN 900001 AND 900050;

SELECT
    COUNT(*) AS MovimientosSemilla,
    SUM(CASE WHEN TipoMovimiento = N'Alta' THEN 1 ELSE 0 END) AS Altas,
    SUM(CASE WHEN TipoMovimiento = N'Cambio' THEN 1 ELSE 0 END) AS Cambios,
    SUM(CASE WHEN TipoMovimiento = N'Baja' THEN 1 ELSE 0 END) AS Bajas
FROM Movimientos
WHERE IdEmpleado BETWEEN 900001 AND 900050;
GO
