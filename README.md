# Tech Exam

Aplicación web para administrar empleados y consultar su historial de movimientos. El proyecto utiliza una API REST en ASP.NET Core, un frontend en Angular y SQL Server como base de datos.

## Funcionalidades

- Consulta paginada de empleados y movimientos.
- Búsqueda de empleados por nombre o identificador.
- Alta y actualización de empleados.
- Baja lógica de empleados.
- Totales de empleados activos e inactivos.
- Filtro de movimientos por empleado.
- Historial automático de movimientos de alta, cambio y baja.
- Depuración programada de empleados inactivos sin actividad reciente.
- Interfaz oscura, minimalista y adaptable a distintos tamaños de pantalla.

## Tecnologías

### Backend

- .NET 10
- ASP.NET Core Web API
- ADO.NET
- Microsoft.Data.SqlClient
- Swagger

### Frontend

- Angular 22
- TypeScript
- Bootstrap 5
- SweetAlert2
- RxJS

### Base de datos

- Microsoft SQL Server
- Stored procedures
- SQL Server Agent

## Estructura del repositorio

```text
Tech_Exam/
├── database/                 Scripts de creación, procedimientos y datos de prueba
├── TechExamBackend/          Solución de ASP.NET Core
│   └── TechExamBackend/
│       ├── Controllers/
│       ├── Data/
│       ├── Dtos/
│       ├── Models/
│       └── Repositories/
└── TechExamFrontend/         Aplicación Angular
    └── src/
        ├── app/
        ├── core/
        └── environments/
```

## Requisitos previos

Antes de iniciar, instala:

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- Node.js compatible con Angular 22
- npm
- Microsoft SQL Server
- SQL Server Management Studio o `sqlcmd`
- SQL Server Agent, únicamente si se utilizará el trabajo de depuración

Comprueba las instalaciones:

```powershell
dotnet --version
node --version
npm --version
```

## Inicialización de la base de datos

Los scripts se encuentran en la carpeta `database` y deben ejecutarse en el siguiente orden:

1. `01-create-database.sql`
2. `02-create-tables.sql`
3. `03-create-stored-procedures.sql`
4. `04-create-server-agent-job.sql` — opcional
5. `05-seed-test-data.sql` — opcional

> [!WARNING]
> `02-create-tables.sql` elimina las tablas `Movimientos` y `Empleados` si ya existen. Al ejecutarlo se perderán los datos almacenados en esas tablas.

### Desde SQL Server Management Studio

Abre cada archivo, conéctate a la instancia local y ejecútalo respetando el orden anterior.

### Desde la terminal

El siguiente ejemplo utiliza autenticación integrada de Windows:

```powershell
sqlcmd -S localhost -E -i database/01-create-database.sql
sqlcmd -S localhost -E -i database/02-create-tables.sql
sqlcmd -S localhost -E -i database/03-create-stored-procedures.sql
```

Para instalar el trabajo de depuración:

```powershell
sqlcmd -S localhost -E -i database/04-create-server-agent-job.sql
```

Este paso requiere SQL Server Agent activo y permisos para crear trabajos en `msdb`.

### Datos de prueba

Para agregar los datos de prueba:

```powershell
sqlcmd -S localhost -E -i database/05-seed-test-data.sql
```

La semilla:

- Crea exactamente 50 empleados dentro del rango `900001–900050`.
- Incluye empleados activos e inactivos.
- Genera movimientos de alta, cambio y baja.
- Incluye casos para probar paginación, búsqueda, caracteres especiales y nombres de 20 caracteres.
- Incluye un empleado con más de 10 movimientos y otro sin movimientos.
- Puede ejecutarse varias veces porque reemplaza únicamente los registros de su rango.

Uno de los empleados inactivos está diseñado para probar el procedimiento de depuración. Si se ejecuta `sp_DepuracionEmpleados`, ese registro puede ser eliminado.

## Configuración del backend

La cadena de conexión se encuentra en:

```text
TechExamBackend/TechExamBackend/appsettings.json
```

Valor predeterminado:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=EXAMEN;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Modifica `Server`, las credenciales o el tipo de autenticación según tu instalación de SQL Server.

Para evitar guardar credenciales en el repositorio, también puedes definir la cadena mediante una variable de entorno:

```powershell
$env:ConnectionStrings__DefaultConnection="Server=localhost;Database=EXAMEN;Trusted_Connection=True;TrustServerCertificate=True;"
```

## Ejecución del backend

Desde la raíz del repositorio:

```powershell
dotnet restore TechExamBackend/TechExamBackend.slnx
dotnet run --project TechExamBackend/TechExamBackend/TechExamBackend.csproj --launch-profile http
```

La API estará disponible en:

```text
http://localhost:5082
```

Swagger estará disponible en modo Development:

```text
http://localhost:5082/swagger
```

## Ejecución del frontend

En otra terminal:

```powershell
cd TechExamFrontend
npm install
npm start
```

Abre:

```text
http://localhost:4200
```

El frontend utiliza por defecto la API configurada en:

```text
TechExamFrontend/src/environments/environments.ts
```

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5082/api',
};
```

Si se cambia el puerto del backend, también debe actualizarse este valor. La política CORS actual permite solicitudes desde `http://localhost:4200`.

## Inicio rápido

Después de instalar los requisitos:

```powershell
# Terminal 1: backend
dotnet run --project TechExamBackend/TechExamBackend/TechExamBackend.csproj --launch-profile http

# Terminal 2: frontend
cd TechExamFrontend
npm install
npm start
```

## Endpoints principales

### Empleados

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/Empleados` | Obtiene empleados paginados |
| `GET` | `/api/Empleados/{idEmpleado}` | Obtiene un empleado |
| `POST` | `/api/Empleados` | Crea un empleado |
| `PUT` | `/api/Empleados/{idEmpleado}` | Actualiza un empleado activo |
| `DELETE` | `/api/Empleados/{idEmpleado}` | Da de baja a un empleado |

Parámetros disponibles para `GET /api/Empleados`:

| Parámetro | Predeterminado | Restricción |
|---|---:|---|
| `pageNumber` | `1` | Mayor que cero |
| `pageSize` | `10` | Entre 1 y 100 |
| `query` | Vacío | Máximo 20 caracteres |

Ejemplo:

```text
GET /api/Empleados?pageNumber=1&pageSize=10&query=Ana
```

### Movimientos

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/Movimientos` | Obtiene todos los movimientos paginados |
| `GET` | `/api/Movimientos/{idMovimiento}` | Obtiene un movimiento |
| `GET` | `/api/Movimientos/empleado/{idEmpleado}` | Obtiene movimientos paginados de un empleado |

Los endpoints paginados de movimientos aceptan `pageNumber` y `pageSize`.

## Reglas de negocio

- El identificador del empleado debe ser un entero mayor que cero.
- No puede existir más de un empleado con el mismo identificador.
- Un empleado inactivo no puede modificarse.
- Un empleado no puede darse de baja dos veces.
- Cada alta, cambio o baja genera un movimiento.
- Los tipos de movimiento permitidos son `Alta`, `Cambio` y `Baja`.
- El nombre es obligatorio y permite un máximo de 20 caracteres.
- La búsqueda por empleado acepta nombre o identificador y un máximo de 20 caracteres.
- Cada dia se realiza un depurado a los empleados inactivos con mas de 3 meses sin actividad.

# Proceso de creación

## Bases del proyecto

- Comencé creando la base del backend con la plantilla de ASP.NET Core Web API para trabajar con .NET y C#.
- Después creé la base del frontend utilizando Angular y CSS.

## Base de datos

- Creé los scripts necesarios para generar la base de datos y sus tablas de acuerdo con la estructura indicada en el documento.
- Tomé en cuenta las dos tablas existentes y la relación entre ellas.
- Creé los stored procedures necesarios para las acciones que utilizaría la API.
- Finalmente, creé el Job encargado de la depuración de empleados.

## Backend

- Agregué el paquete `Microsoft.Data.SqlClient` para realizar la conexión con la base de datos mediante ADO.NET.
- Configuré la cadena de conexión dentro de `appsettings.json`, apuntando a la instancia local de SQL Server.
- La estructura del backend se creó en el siguiente orden:
  - Modelos
  - DTOs
  - Connection Factory
  - Repositories
  - Controllers
- Configuré la inyección de dependencias y CORS para permitir la comunicación con el frontend.
- Probé los endpoints con ayuda de Swagger.

## Frontend

- Comencé generando las plantillas de los componentes, servicios y modelos.
- Habilité `HttpClient` dentro de `app.config.ts`.
- Instalé Bootstrap para utilizar componentes y estilos de interfaz.
- Instalé SweetAlert2 para mostrar alertas más modernas.
- La estructura del frontend se creó en el siguiente orden:
  - Models
  - Services
  - Routes
  - Pantallas
- Busqué referencias de diseño en internet hasta encontrar una interfaz adecuada para la aplicación.

## Refinamiento

Una vez que tuve una base funcional del programa, agregué algunas funciones que consideré necesarias:

- Paginación.
- Nombre del empleado en el listado de movimientos.
- Buscador.
- Cantidad de empleados activos y dados de baja.