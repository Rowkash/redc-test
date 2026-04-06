NestJS test task app (REST API)

### Prerequisites
Docker and Docker Compose installed.

1. Environment Setup.

   Create a .env file in the root directory. You can use the provided template or the example below:

```shell
APP_PORT=

# Database configuration
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# JWT configuration
JWT_SECRET=billy_herrington
JWT_EXPIRES_IN=1d

REDIS_URI=redis://redis:6379
```

2. Launching the Application

Use Docker Compose to build and start all services (Node.js, PostgreSQL, Redis, and Nginx):

    docker compose --env-file .env up --build -d

### API Documentation

The application is served through an Nginx reverse proxy. To maintain security and architectural integrity, all external requests should go through the proxy.

    Swagger UI: http://localhost:8080/api/doc

The PostgreSQL port is exposed to the host machine for development and debugging purposes. You can connect using your preferred DB client (e.g., DBeaver, TablePlus):

    Host: localhost

    Port: 5432

    User/Password: (As defined in your .env)

After app successfully run there is already created admin user. Default login data:
```shell
email: "benfrank@protonmail.com",
password: "password"   
```
