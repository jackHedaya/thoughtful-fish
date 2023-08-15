# Thoughtful Fish

The beautiful portal to help you invest
<p align="center">
<img width="800" alt="Screenshot 2023-08-15 at 3 59 53 PM" src="https://github.com/jackHedaya/thoughtful-fish/assets/20172754/9afb67b2-2499-4d17-b3c8-a4298b7ea9a8">
</p>


## Development

### Install needed dependencies

- `$ brew install mkcert nss`

### Setup repository

#### Cloning

- `stable`: `$ git clone --branch master https://github.com/jackHedaya/thoughtful-fish`
- `develop`: `$ git clone https://github.com/jackHedaya/thoughtful-fish`

#### Dependencies

- `$ cd thoughtful-fish && yarn`

### Setup development server

These steps are needed to configure SSL on localhost

- `$ mkcert -install`
- `$ cd dev-server && mkcert localhost`
- `$ cp "$(mkcert -CAROOT)/rootCA.pem" ./`

### Configure `.env.local`

- `$ touch .env.local`
- Populate `.env.local` with `CONSUMER_KEY`, `JWT_SECRET`, `REDIRECT_URI` and `NODE_TLS_REJECT_UNAUTHORIZED=0`

### Running

_Make sure you are in root folder at this point_

- `$ yarn dev`
