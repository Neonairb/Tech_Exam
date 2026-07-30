USE EXAMEN;
GO

IF OBJECT_ID('Movimientos', 'U') IS NOT NULL
    DROP TABLE Movimientos;
GO

IF OBJECT_ID('Empleados', 'U') IS NOT NULL
    DROP TABLE Empleados;
GO

CREATE TABLE Empleados (
    IdEmpleado INT PRIMARY KEY,
    Nombre NVARCHAR(20) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaAlta  DATETIME2 DEFAULT SYSDATETIME(),
    FechaModificacion DATETIME2
);

CREATE TABLE Movimientos (
    IdMovimiento INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    IdEmpleado INT NOT NULL,
    TipoMovimiento NVARCHAR(20) NOT NULL,
    FechaMovimiento DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT FK_Movimientos_Empleados
        FOREIGN KEY (IdEmpleado) REFERENCES Empleados(IdEmpleado),

    CONSTRAINT CK_Tipo_Movimiento
        CHECK (TipoMovimiento IN ('Alta', 'Baja', 'Cambio'))
);
GO
