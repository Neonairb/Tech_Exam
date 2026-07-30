USE EXAMEN;
GO

-- Empleados
CREATE OR ALTER PROCEDURE sp_Empleados_ObtenerTodos
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @PageNumber < 1
    BEGIN
        THROW 50001, 'El número de página y el tamaño de página deben ser mayores que cero.', 1;
    END;

    IF @PageSize < 1 OR @PageSize > 100
    BEGIN
        THROW 50001, 'El tamaño de página debe estar entre 1 y 100.', 1;
    END;

    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    SELECT *
    FROM Empleados
    ORDER BY IdEmpleado
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalRegistros
    FROM Empleados;
END;
GO

CREATE OR ALTER PROCEDURE sp_Empleados_ObtenerPorId
    @IdEmpleado INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Empleados AS e
    WHERE e.IdEmpleado = @IdEmpleado;
END;
GO

CREATE OR ALTER PROCEDURE sp_Empleados_Crear
    @IdEmpleado INT,
    @Nombre NVARCHAR(50)
AS
BEGIN TRY
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    IF @IdEmpleado <= 0
    BEGIN
        THROW 50003, 'El identificador del empleado debe ser mayor que cero.', 1;
    END;

    IF EXISTS
    (
        SELECT 1
        FROM dbo.Empleados
        WHERE IdEmpleado = @IdEmpleado
    )
    BEGIN
        THROW 50004, 'Ya existe un empleado con ese identificador.', 1;
    END;

    IF NULLIF(LTRIM(RTRIM(@Nombre)), '') IS NULL
    BEGIN
        THROW 50003, 'El nombre del empleado es obligatorio.', 1;
    END;

    INSERT INTO Empleados (
        IdEmpleado, 
        Nombre
    )
    VALUES (
        @IdEmpleado, 
        @Nombre
    );

    INSERT INTO Movimientos (
        IdEmpleado,
        TipoMovimiento
    )
    VALUES (
        @IdEmpleado, 
        'Alta'
    );

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
GO

CREATE OR ALTER PROCEDURE sp_Empleados_Actualizar
    @IdEmpleado INT,
    @Nombre NVARCHAR(50)
AS
BEGIN TRY
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    IF NULLIF(LTRIM(RTRIM(@Nombre)), '') IS NULL
    BEGIN
        THROW 50003, 'El nombre del empleado es obligatorio.', 1;
    END;

    IF EXISTS
    (
        SELECT 1
        FROM dbo.Empleados
        WHERE IdEmpleado = @IdEmpleado
          AND Activo = 0
    )
    BEGIN
        THROW 50006, 'No se puede modificar un empleado inactivo.', 1;
    END;

    UPDATE Empleados
    SET Nombre = @Nombre,
        FechaModificacion = SYSDATETIME()
    WHERE IdEmpleado = @IdEmpleado;

    IF @@ROWCOUNT = 0
    BEGIN
        THROW 50001, 'El empleado no existe.', 1;
    END;

    INSERT INTO Movimientos (
        IdEmpleado,
        TipoMovimiento
    )
    VALUES (
        @IdEmpleado, 
        'Cambio'
    );

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
GO

CREATE OR ALTER PROCEDURE sp_Empleados_DarDeBaja
    @IdEmpleado INT
AS
BEGIN TRY
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    IF EXISTS
    (
        SELECT 1
        FROM dbo.Empleados
        WHERE IdEmpleado = @IdEmpleado
        AND Activo = 0
    )
    BEGIN
        THROW 50005, 'El empleado ya se encuentra dado de baja.', 1;
    END;

    UPDATE Empleados
    SET Activo = 0,
        FechaModificacion = SYSDATETIME()
    WHERE IdEmpleado = @IdEmpleado;

    IF @@ROWCOUNT = 0
    BEGIN
        THROW 50002, 'El empleado no existe.', 1;
    END;

    INSERT INTO Movimientos (
        IdEmpleado,
        TipoMovimiento
    )
    VALUES (
        @IdEmpleado, 
        'Baja'
    );

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
GO

-- Movimientos
CREATE OR ALTER PROCEDURE sp_Movimientos_ObtenerTodos
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @PageNumber < 1
    BEGIN
        THROW 50001, 'El número de página y el tamaño de página deben ser mayores que cero.', 1;
    END;

    IF @PageSize < 1 OR @PageSize > 100
    BEGIN
        THROW 50001, 'El tamaño de página debe estar entre 1 y 100.', 1;
    END;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    SELECT *
    FROM Movimientos
    ORDER BY FechaMovimiento DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalRegistros
    FROM Movimientos;
END;
GO

CREATE OR ALTER PROCEDURE sp_Movimientos_ObtenerPorId
    @IdMovimiento INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Movimientos AS m
    WHERE m.IdMovimiento = @IdMovimiento;
END;
GO

CREATE OR ALTER PROCEDURE sp_Movimientos_ObtenerPorEmpleado
    @IdEmpleado INT,
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    IF @PageNumber < 1
    BEGIN
        THROW 50001, 'El número de página y el tamaño de página deben ser mayores que cero.', 1;
    END;

    IF @PageSize < 1 OR @PageSize > 100
    BEGIN
        THROW 50001, 'El tamaño de página debe estar entre 1 y 100.', 1;
    END;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    SELECT *
    FROM Movimientos
    WHERE IdEmpleado = @IdEmpleado
    ORDER BY FechaMovimiento DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalRegistros
    FROM Movimientos
    WHERE IdEmpleado = @IdEmpleado;
END;
GO

-- Depurado
CREATE OR ALTER PROCEDURE sp_DepuracionEmpleados 
AS
BEGIN TRY
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    DECLARE @EmpleadosDepurados TABLE
    (
        IdEmpleado INT PRIMARY KEY
    );
    
    INSERT INTO @EmpleadosDepurados (IdEmpleado)
    SELECT e.IdEmpleado
    FROM Empleados AS e
    WHERE e.Activo = 0
    AND
    (
        SELECT MAX(m.FechaMovimiento)
        FROM Movimientos AS m
        WHERE m.IdEmpleado = e.IdEmpleado
    ) < DATEADD(MONTH, -3, SYSDATETIME())
    

    DELETE FROM Movimientos
    WHERE IdEmpleado IN
    (
        SELECT IdEmpleado
        FROM @EmpleadosDepurados
    );

    DELETE FROM Empleados
    Where IdEmpleado IN
    (
        SELECT IdEmpleado
        FROM @EmpleadosDepurados
    );

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
GO