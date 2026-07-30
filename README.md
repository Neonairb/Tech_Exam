# Tech_Exam


# Proceso de creacion:
## Bases del proyecto
- Comence creando la base del backend con la plantilla de ASP.NET Core Web API para utilizar .Net C#.
- Continue con la base del frontend para lo que use Angular con CSS.
## Base de Datos
- Cree los scrips que servirian para crear la base de datos y sus tablas deacuerdo a la estructura del documento.
    - Tome en cuenta la 2 tablas existente y su relacion
    - Cree los stored procedures para las todas las acciones que se necesitaran en la API.
    - Termine creando el Job para la depuracion de usuario
## Backend
- Agrege el paquete de SqlClient en el proyecto para hacer la coneccion con ADO.Net.
- Especifique el string de coneccion dentro del appsetting.json apuntando a localhost.
- La estructura del backend fue creada en este orden:
    - Modelos
    - Dtos
    - Connection Factory
    - Repositories
    - Controllers
- Configurar la injeccion de dependencias y cors para el front end
- Los endpoins fueron testeados con la ayuda de swagger
## Frontend
- Empece por generar las plantillas de los componentes, servicios y modelos.
- Habilite HttpClient en el app.config.
- Instale bootstrap para componentes de diseno
- Instale sweetalert2 para alertas modernas
- la estructura fue creada en este orden:
    - Models
    - Services
    - Routes
    - Pantallas
- Busque en internet por un diseno que me convenza para la aplicacion
