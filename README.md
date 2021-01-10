# Thoughtful Fish

The beautiful portal to help you invest

## Development

### Install needed dependencies

- `$ brew install mkcert nss`

### Setup repository

- `$ git clone https://github.com/jackHedaya/thoughtful-fish`
- `$ cd thoughtful-fish && yarn`

### Setup development server

These steps are needed to configure SSL on localhost

- `$ mkcert -install`
- `$ cd dev-server && mkcert localhost`
- `$ cp "$(mkcert -CAROOT)/rootCA.pem" ./`

### Configure `.env.local`

- `$ touch .env.local`
- Populate `.env.local` with `CONSUMER_KEY`, `NEXTAUTH_URL="https://localhost:3000/"` and `NODE_TLS_REJECT_UNAUTHORIZED=0`

### Running

_Make sure you are in root folder at this point_

- `$ yarn dev`
