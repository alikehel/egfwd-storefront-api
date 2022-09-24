# StoreFront API

## How to start the project

- run `npm i`
- run `npm i db-migrate -g`
- run `npm run createdatabase` to create the database
- run `npm run migrate:up` to create the database tables
- add .env file to the directory
- run `npm run start:dev`

## ENV variables

```env
PORT=3000
POSTGRES_DB=storefront
POSTGRES_DB_TEST=storefront_test
POSTGRES_USER=ke7el
POSTGRES_HOST=127.0.0.1
POSTGRES_PASSWORD=ke7elpass
ENV = 'dev'
SECRET = 'THISISSECRET'
```

## Creating the database user

```sql
CREATE USER ke7el WITH PASSWORD 'ke7elpass';
GRANT ALL PRIVILEGES ON DATABASE "storefront_dev" TO ke7el;
GRANT ALL PRIVILEGES ON DATABASE "storefront_test" TO ke7el;
```

## Database port

- 5432

## Testing

- run `npm run test`
