USE msdb;
GO

EXEC dbo.sp_add_job
    @job_name = N'DepuracionEmpleados',
    @enabled = 1,
    @description = N'Elimina empleados cuya última actividad supera los 3 meses.';
GO

EXEC dbo.sp_add_jobstep
    @job_name = N'DepuracionEmpleados',
    @step_name = N'Ejecutar depuración',
    @subsystem = N'TSQL',
    @database_name = N'EXAMEN',
    @command = N'EXEC sp_DepuracionEmpleados;',
    @on_success_action = 1,
    @on_fail_action = 2;
GO

EXEC dbo.sp_add_schedule
    @schedule_name = N'Diario_5AM',
    @enabled = 1,
    @freq_type = 4,
    @freq_interval = 1,
    @active_start_time = 050000;
GO

EXEC dbo.sp_attach_schedule
    @job_name = N'DepuracionEmpleados',
    @schedule_name = N'Diario_5AM';
GO

EXEC dbo.sp_add_jobserver
    @job_name = N'DepuracionEmpleados';
GO