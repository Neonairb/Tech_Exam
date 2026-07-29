USE msdb;
GO

-- Eliminar Job anterior si existe
IF EXISTS
(
    SELECT 1
    FROM dbo.sysjobs
    WHERE name = N'DepuracionEmpleados'
)
BEGIN
    EXEC dbo.sp_delete_job
        @job_name = N'DepuracionEmpleados',
        @delete_unused_schedule = 1;
END;
GO

-- Crear Job
EXEC dbo.sp_add_job
    @job_name = N'DepuracionEmpleados',
    @enabled = 1,
    @description = N'Proceso diario de depuración de empleados con más de tres meses sin movimientos.',
    @category_name = N'[Uncategorized (Local)]';
GO

-- Crear el paso que ejecuta el stored procedure
EXEC dbo.sp_add_jobstep
    @job_name = N'DepuracionEmpleados',
    @step_name = N'Ejecutar sp_DepuracionEmpleados',
    @subsystem = N'TSQL',
    @database_name = N'EXAMEN',
    @command = N'EXEC sp_DepuracionEmpleados;',
    @retry_attempts = 0,
    @retry_interval = 0,
    @on_success_action = 1,
    @on_fail_action = 2;
GO

-- Programar la hora de ejecucion del Job
EXEC dbo.sp_add_jobschedule
    @job_name = N'DepuracionEmpleados',
    @name = N'Depuracion diaria 05:00',
    @enabled = 1,
    @freq_type = 4,
    @freq_interval = 1,
    @freq_subday_type = 1,
    @active_start_date = 20260101,
    @active_start_time = 050000;
GO

-- Asignar el Job al servidor
EXEC dbo.sp_add_jobserver
    @job_name = N'DepuracionEmpleados';
GO