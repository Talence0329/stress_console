const express = require('express')
const http = require('http')
var cors = require('cors')
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
var { SystemController, WebsocketController, JmeterController, WorkController } = require('./controller')
var app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use('/report', express.static('warehouse/report'))

app.get('/', function (req, res) {
  res.send('お前たちはＯＯです')
})
app.post('/jmeter', async function (req, res) {
  res.send(await JmeterController.HandleRequest(req))
})
app.post('/work', async function (req, res) {
  res.send(await WorkController.HandleRequest(req))
})

const server = http.createServer(app)
const wss = new WebsocketController(server, SystemController, WorkController)
WorkController.wss = wss

server.listen(8888, function () {
  console.log('始まりよ！')
})
