# Conexa Challenge Api

## Links

`<api>` : <https://conexa-challenge-api.onrender.com/>
`<docs>` : <https://conexa-challenge-api.onrender.com/docs>

---

## Instructions

- Clone Repository
- Create .env from .env.template and load variables
- Install dependencies
- Create DB Postgres with docker-compose.yml
- Run migrations
- Run server

#### Clone Repository

```sh
https://github.com/maxiereyes/conexa-challenge-api.git
```

#### Create .env

```sh
PORT=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_LOGGING=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
```

#### Install Dependencies

```sh
npm install
```

#### Create Database Postgres

```sh
docker compose up -d
```

#### Run migrations

```sh
npm run migration:run
```

#### Run server

```sh
npm run start:dev
```

## Swagger Documentation

- Copy this link in your browser

```sh
http://{url}/docs
```

## Run Testing

```sh
npm run test
```

## Flow Authentication

```seq
Client->Server: POST auth/register {email, password}
Note left of Client: -Register new user
Note right of Server: -Verify User \n -Generate Access and Refresh Token
Server-->Client: 200 OK {accessToken, refreshToken}
Client->Server: GET movie/:id \n Authorization Bearer {accessToken}
Note right of Server: -Validate accessToken \n if invalid send Unauthorized exception
Server-->Client: 400 Unauthorized \n Token Expired
Note left of Client: -Request new tokens
Client->Server: GET auth/refresh-token \n Authorization Bearer {refreshToken}
Server-->Client: 200 OK {accessToken, refreshToken}
```
