/* eslint-disable @typescript-eslint/no-var-requires */

var https = require('https')
var fs = require('fs')

const next = require('next')
const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: require('path').join(__dirname, '../') })
const handle = app.getRequestHandler()

var options = {
  key: fs.readFileSync('./dev-server/localhost-key.pem'),
  cert: fs.readFileSync('./dev-server/localhost.pem'),
  ca: [fs.readFileSync('./dev-server/rootCA.pem')],
}

app.prepare().then(() => {
  https
    .createServer(options, (req, res) => {
      handle(req, res)
    })
    .listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on https://localhost:${port}`)
    })
})
