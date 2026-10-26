# Coworking bookings

Room booking system for a coworking space, split into four NestJS services that talk over TCP.

I built it to practise microservices with NestJS: request-response between services, events, one database per service and a hexagonal layout inside each service.

## Services

| Service               | Transport | Port | Database         |
| --------------------- | --------- | ---- | ---------------- |
| api-gateway           | HTTP      | 3000 | none             |
| bookings-service      | TCP       | 3001 | bookings_db      |
| rooms-service         | TCP       | 3002 | rooms_db         |
| notifications-service | TCP       | 3003 | notifications_db |

The gateway is the only public entry point. It validates the request and forwards it to the right service with `ClientProxy.send`. The internal services only listen on TCP.

```
client -> api-gateway --send--> rooms-service
                      --send--> bookings-service --send--> rooms-service
                                                 --emit--> notifications-service
                      --send--> notifications-service
```

When a booking is created, bookings checks that the dates make sense, looks for overlapping bookings in its own table, asks rooms for the room (to check it exists and get the hourly price), works out the total price, saves it and emits `booking_created`. Cancelling a booking emits `booking_cancelled`. Notifications listens to both events and stores a message for the customer.

## Errors

Use cases throw domain errors (`BookingNotFoundError`, `BookingConflictError`, `RoomNotFoundError`...) that carry their own status code and know nothing about HTTP or Nest. Each service has an RPC filter that turns them into a plain `{ statusCode, message }` object, which is what travels over TCP. The gateway has an HTTP filter that reads that object and answers with the right status, so a missing room ends up as a 404 for the client instead of a generic 500.

When bookings calls rooms, its gateway adapter catches the error coming back and turns it into a bookings domain error, so the filter in bookings can handle it like any other.

## Layout

Each internal service follows the same structure:

```
src/<resource>/
  domain/          models, repository and gateway interfaces
  application/     use cases (finders, creators, deleters)
  infrastructure/  message handlers, TypeORM entities, repository implementations, Nest module
```

Use cases depend on the repository interface, not on TypeORM. The implementation is bound in the module through an injection token, so the use cases can be tested with an in-memory repository.

## Running it locally

Requirements: Node 20+ and Docker.

```bash
# Postgres with the three databases
docker compose up -d

# In each service
cp .env.example .env
npm install
npm run start:dev
```

Start the internal services first and the gateway last.

## API

| Method | Path                  |                              |
| ------ | --------------------- | ---------------------------- |
| GET    | /rooms                | List rooms                   |
| GET    | /rooms/:id            | Get a room                   |
| POST   | /rooms                | Create a room                |
| POST   | /bookings             | Create a booking             |
| GET    | /bookings/:id         | Get a booking                |
| DELETE | /bookings/:id         | Cancel a booking             |
| GET    | /notifications?email= | Notifications for a customer |

## Tests

```bash
npm test
```

Unit tests cover the use cases of rooms and notifications with in-memory repositories.

## Next

- Users service with JWT auth and roles, checked in the gateway
- RabbitMQ instead of TCP for events, so they are not lost if notifications is down
- TypeORM migrations instead of `synchronize`, Docker Compose for every service and CI
