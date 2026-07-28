USE EXAMEN;
GO

IF OBJECT_ID('dbo.Movimientos', 'U') IS NOT NULL
    DROP TABLE dbo.Movimientos;
GO

IF OBJECT_ID('dbo.Empleados', 'U') IS NOT NULL
    DROP TABLE dbo.Empleados;
GO

CREATE TABLE Empleados (
    IdEmpleado INT PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Activo BIT NOT NULL,
    FechaAlta  DATETIME DEFAULT GETDATE(),
    FechaModificacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE Movimientos (
    IdMovimiento INT PRIMARY KEY IDENTITY(1,1),
    IdEmpleado INT NOT NULL,
    TipoMovimiento NVARCHAR(20) NOT NULL,
    FechaMovimiento DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Movimientos_Empleados
        FOREIGN KEY (IdEmpleado) REFERENCES Empleados(IdEmpleado),

    CONSTRAINT CK_Tipo_Movimiento
        CHECK (TipoMovimiento IN ('ENTRADA', 'SALIDA', 'AJUSTE')),
)