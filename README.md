# Switchhive Task Management

## Overview

Switchhive Product Management is a comprehensive product management application offering robust features for user authentication and product management via REST APIs.

## Features

### User Authentication APIs
 - **Register New Users:** Create new user accounts.
 
 - **Login and Manage Sessions:** Securely authenticate and manage user sessions. The access token expires in 1 day, while the refresh token remains valid for 7 days

### Product Management APIs
 - **Product Creation:** Add new products to the system.

 - **Update Products:** Modify existing Products.

 - **Get Single Product:** Retrieve details of a specific product.

 - **Get All Products:** List all Products.

 - **Get Products by UserId:** Fetch Products categorized by userId.

 - **Delete Products:** Remove Products from the system.


## Security and Additional Features

 - **Prevent Multiple Sign-ins:** Added a security layer to prevent multiple sign-ins from different devices.
 - **JWT Token and Refresh Token:** Secure authentication using JWT and refresh tokens.


## Tools

 - **Backend Framework:** Nestjs
 - **Devops:** Docker
 - **Database:** Postgres
 - **Programming Lanaguage:** Typescript

## Postman Documentation
Refer to the [Postman Documentation](https://documenter.getpostman.com/view/11996278/2sA3QmCu5h) for detailed API information.


## Installation

### Clone the GitHub Repository

```bash
$ git clone https://github.com/kennethihezie/switchhive_tech_task.git
$ cd switchhive_tech_task
```

## Install Project Dependencies

```bash
$ yarn install
```

## Add .env to the Root of the Project
Create a `.env` file in the root directory with the following keys:

```bash
DB_NAME='switchhive_db'
DB_USER_NAME='switchhive_user'
DB_PASSWORD='switchhive_password_$'
DB_PORT=5432
DB_HOST='db'
JWT_SECRET='hL+32sdNFWjr/Tkviwfwznxce1JQuG52gawIC6P4boM2xxvQpCi0VoIguDVdiGdacvTkv/mnbqvoz6AEKGTIwU8Mpxay+UtC3TmsZxHFz5mWn7P3VhPC+DlRV74eJzI0SX0K5TQcVBpbEfnubUDadSSBgQGOKJs1fZOO4roUMdDnWFucWgtLZ0rid3m9yQu+HufmYqCpBsZjPTT73VRtbjQUWhZ2DQl75057TecQGpfM2yK7XUdSHjB5tU62dEk0l2cvpP8Bwk+jNGKbwvpWyzCdotkwMhlzFa85uzSy/JfXtWwEVvPGn78PJ0hxQSmEWT6UZ2usyGGbgnsSkVWAxw=='
JWT_REFRESH_SECRET = 'K/ezIHSQvw/KMtU0d9GcuMgQYhYEgz5y++ZSgDJxWWWLj5Ryu4xmcqi6OagcMMKK8PZqzNtVz4as9qCCDh2n3Ajfhh5Hr54HyFAbfpOSfrPpm6ztL3zr4Mbl3EVLUtqN+2Oc9EApp3xguMmWzIpu4d6YaMp513FQ/WVZpWeJWeImbXY6znnc/dvvquFx5Q48IDCIkYk6RlhV1v5Vv+oGdtKqDaGFh/J9t5tPcXdZFcHq1x0JkCm3WJzEbhxfd3DukwVGIeU+70/PAdp3iVVnY8Z4//5EE507HLbOzCXVEIaqmA6QHFbSLzg0VE5B6BkR0DyZ8CzQdwL+EBDtHh6ONw=='
```
 
 # Usage

## Running the app

```bash
# build and run the app in background
$ docker compose up -d --build

# build and run the app in foreground
$ docker compose up --build

# run the app in background
$ docker compose up -d

# run the app in foreground
$ docker compose up
```

## Test

```bash
# unit tests
$ yarn run test
```


## Stay in touch

- Author - [Collins Kenneth Ihezie](https://github.com/kennethihezie/)
- Email - [collinsihezie6@gmail.com](mailto://collinsihezie6@gmail.com)

## License

Nest is [MIT licensed](LICENSE).
