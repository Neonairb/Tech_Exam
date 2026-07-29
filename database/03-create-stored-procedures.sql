USE EXAMEN;
GO

-- Empleados
CREATE PROCEDURE sp_Empleados_ObtenerTodos
AS
BEGIN
    SET NOCOUNT ON
    SELECT * FROM Empleados;
END;
GO

CREATE PROCEDURE sp_Empleados_ObtenerPorId
    @IdEmpleado INT
AS
BEGIN
    SET NOCOUNT ON
    SELECT * FROM Empleados AS e
    WHERE e.IdEmpleado = @IdEmpleado;
END;
GO

CREATE PROCEDURE sp_Empleados_Crear
    @IdEmpleado INT,
    @Nombre NVARCHAR(50)
AS
BEGIN TRY
    SET NOCOUNT ON
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

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

CREATE PROCEDURE sp_Empleados_Actualizar
    @IdEmpleado INT,
    @Nombre NVARCHAR(50)
AS
BEGIN TRY
    SET NOCOUNT ON
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

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

CREATE PROCEDURE sp_Empleados_DarDeBaja
    @IdEmpleado INT
AS
BEGIN TRY
    SET NOCOUNT ON
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

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
CREATE PROCEDURE sp_Movimientos_ObtenerTodos
AS
BEGIN
    SET NOCOUNT ON
    SELECT * FROM Movimientos;
END;
GO

CREATE PROCEDURE sp_Movimientos_ObtenerPorId
    @IdMovimiento INT
AS
BEGIN
    SET NOCOUNT ON
    SELECT * FROM Movimientos AS m
    WHERE m.IdMovimiento = @IdMovimiento;
END;
GO

CREATE PROCEDURE sp_Movimientos_ObtenerPorEmpleado
    @IdEmpleado INT
AS
BEGIN
    SET NOCOUNT ON
    SELECT * FROM Movimientos AS m
    WHERE m.IdEmpleado = @IdEmpleado;
END;
GO

-- Depurado
CREATE PROCEDURE sp_DepuracionEmpleados 
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
    WHERE
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