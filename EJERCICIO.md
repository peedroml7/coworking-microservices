# Práctica: reservas de salas de coworking

Un coworking alquila salas por horas. Los clientes reservan, pagan y reciben confirmación.

## Arquitectura

```
cliente HTTP
    |
    v
api-gateway (HTTP 3000)  -- único punto de entrada, sin base de datos
    |-- send --> rooms-service          (TCP 3002, Postgres rooms_db)
    |-- send --> bookings-service       (TCP 3001, Postgres bookings_db)
    |                |-- send  --> rooms-service          (¿la sala existe? ¿cuánto cuesta?)
    |                |-- emit  --> notifications-service  (evento)
    |-- send --> notifications-service  (TCP 3003, Postgres notifications_db)
```

## Servicios

### api-gateway

- Expone la API REST pública.
- Valida la entrada con DTOs de class-validator y `ValidationPipe` global.
- Tiene un `ClientProxy` por cada servicio interno y traduce cada endpoint a un `send`.
- No tiene base de datos ni lógica de negocio. Organizado por recurso, sin capas de dominio.

Endpoints:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/rooms` | Listar salas |
| GET | `/rooms/:id` | Detalle de una sala |
| POST | `/rooms` | Crear sala: nombre, capacidad, precio por hora |
| POST | `/bookings` | Crear reserva: sala, inicio, fin, email del cliente |
| GET | `/bookings/:id` | Detalle de una reserva |
| DELETE | `/bookings/:id` | Cancelar reserva |
| GET | `/notifications?email=` | Historial de avisos de un cliente |

### rooms-service

- Dueño de las salas.
- Responde a `find_rooms`, `find_room_by_id` y `create_room`.

### bookings-service

Caso de uso `create_booking`:

1. Pide la sala a rooms con `send('find_room_by_id')`. Si no existe, lanza un error que el gateway convierte en 404.
2. Comprueba en su propia tabla de reservas si hay solapamiento en ese tramo, con un método `hasOverlap` del repositorio. Si lo hay, lanza un error que el gateway convierte en 409.
3. Calcula el precio: horas por el precio por hora que ha devuelto rooms.
4. Guarda la reserva con estado `confirmed`.
5. Emite `booking_created` con todo lo que notificaciones necesita: id, email, sala, fechas y precio.

Condición de solapamiento: un tramo existente choca con el pedido si `existente.start < pedido.end` y `existente.end > pedido.start`, ignorando las reservas canceladas.

Caso de uso `cancel_booking`: cambia el estado a `cancelled` y emite `booking_cancelled`.

### notifications-service

- Escucha `booking_created` y `booking_cancelled` con `@EventPattern`.
- Guarda cada aviso con su tipo, email y payload, y lo "envía" (un log por ahora).
- Responde a `find_notifications_by_email` con `@MessagePattern`.

## Decisiones de diseño a resolver

Documenta en el README qué eliges y por qué.

1. **¿Quién sabe si una sala está libre?** Bookings, porque es quien tiene las reservas. Rooms solo responde si la sala existe y su precio. La alternativa, que rooms guardara una copia de los tramos ocupados escuchando eventos, queda como ampliación para practicar consistencia eventual.
2. **Dos reservas simultáneas para la misma sala y hora.** Las dos preguntan, las dos reciben "libre", las dos guardan. ¿Cómo lo evitas? La respuesta está en la base de datos de quien guarda, no en la comunicación entre servicios.
3. **Rooms está caído cuando llega una reserva.** El `send` se queda colgado. Usa `timeout` de RxJS y haz que el gateway devuelva un 503 claro.
4. **Notifications está caído cuando se crea una reserva.** Con TCP el evento se pierde.
   - Primera versión: acéptalo y documéntalo.
   - Segunda versión: cambia TCP por RabbitMQ y comprueba que el evento espera en la cola.
5. **Los errores cruzan servicios.** Una `RpcException` de bookings llega al gateway como error genérico. Crea un exception filter en el gateway que la traduzca a 404, 409 o 503 con un cuerpo uniforme.
6. **Contratos repetidos.** Los nombres de patrones y las interfaces de los payloads están copiados en varios servicios. Llévalos a un paquete `contracts` compartido con npm workspaces.

## Estructura de cada servicio interno

```
src/<recurso>/
├── domain/          modelos, puertos (repositorios y gateways) y errores propios
├── application/     finders y creators (casos de uso)
└── infrastructure/  controladores (@MessagePattern / @EventPattern), entidades TypeORM,
                     implementaciones de repositorios y gateways, módulo
```

Cada servicio con su `.env`, su `ConfigModule` validado y su health check.

## Infraestructura

- `docker-compose.yml` en la raíz con Postgres y una base por servicio, creadas con un script en `docker-entrypoint-initdb.d`.
- RabbitMQ con su panel de gestión en el puerto 15672, para la decisión 4.
- Al final, los cuatro servicios dockerizados con build multietapa. El `host` de cada `ClientProxy` pasa de `localhost` al nombre del servicio en compose.

## Conceptos clave

- **`send` frente a `emit`.** `send` espera respuesta y va con `@MessagePattern`. `emit` es un evento sin respuesta y va con `@EventPattern`.
- **Observable frío.** `send` no envía nada hasta que alguien se suscribe. Se convierte en promesa con `firstValueFrom` y se protege con `timeout`.
- **Fechas.** JSON no tiene tipo fecha: viajan como strings ISO 8601 y se convierten a `Date` al entrar. En Postgres se guardan como `timestamptz` en UTC.
- **`0.0.0.0` frente a `localhost`.** `0.0.0.0` es para el servicio que escucha; el cliente apunta a `localhost` o al nombre del host.
- **Una base de datos por servicio.** Sin claves foráneas ni JOINs entre servicios. Cada uno guarda los datos que necesita de los demás.

## Orden recomendado

1. Rooms con su base de datos y el gateway hablándole con `send`, hasta que `GET /rooms` funcione de punta a punta.
2. Bookings con la creación simple, sin comprobar disponibilidad.
3. Comprobación de disponibilidad en bookings con `find_room_by_id` y `hasOverlap`, y timeout (decisión 3).
4. Notificaciones por eventos.
5. Exception filter del gateway (decisión 5).
6. Tests: unitarios de los casos de uso con puertos falsos y un e2e del gateway.
7. RabbitMQ (decisión 4).
8. Dockerizar los cuatro servicios.
