const stream = require('stream')
const SocketServer = require('ws').Server

class WebsocketController {
  constructor (server, SystemController, WorkController) {
    this.SystemController = SystemController
    this.WorkController = WorkController
    let wss = new SocketServer({ server })
    this.SystemInfo(wss)
    wss.on('connection', ws => {
      this.HandleConnect(ws)
      ws.processStream = {}
      ws.processRecord = {}
      ws.on('message', message => {
        this.HandleMessage(JSON.parse(message), ws)
      })
      ws.on('close', (ws) => {
        this.HandleClose(ws)
      })
      ws.on('error', error => {
        this.HandleError(error)
      })
      ws.send(JSON.stringify({message: 'こんにちは'}))
    })
    this.wss = wss
  }
  Register (req, ws) {
    switch (req.service) {
      case 'system':
        break
      case 'process':
        this.ProcessStream(ws, req)
        break
      default:
        break
    }
  }
  HandleConnect (ws) {
  }
  HandleHeaders (ws) {
  }
  HandleMessage (msg, ws) {
    console.log(msg)
    switch (msg.do) {
      case 'msg':
      case 'message':
        console.log(msg)
        break
      case 'register':
        this.Register(msg, ws)
        break
      default:
        console.error('unkown do')
        break
    }
  }
  HandleListening (ws) {
  }
  HandleClose (ws) {
  }
  HandleError (ws) {
  }
  SystemBroadcast (wss, message) {
    wss.clients.forEach(client => {
      client.send(message)
    })
  }
  SystemInfo (wss) {
    setInterval(() => {
      this.SystemBroadcast(wss, JSON.stringify({type: 'systeminfo', data: this.SystemController.currentRecord}))
    }, 500)
  }
  ProcessStream (ws, req) {
    if (!ws.processStream[req.workId]) {
      ws.processStream[req.workId] = new stream.PassThrough()
    }
    if (!this.WorkController.process[req.workId]) {
      return false
    }
    this.WorkController.process[req.workId].stdout.pipe(ws.processStream[req.workId])
    if (this.WorkController.process[req.workId].processRecord) {
      this.WorkController.process[req.workId].processRecord.forEach(element => {
        ws.send(JSON.stringify({type: 'processstdout', data: {id: req.workId, process: element}}))
      })
    }
    ws.processStream[req.workId].removeAllListeners()
    ws.processStream[req.workId].on('data', (chunk) => {
      ws.send(JSON.stringify({type: 'processstdout', data: {id: req.workId, process: new Date().toLocaleDateString().replace(/\//g, '-') + ' ' + new Date().toLocaleTimeString() + '  ' + chunk.toString()}}))
    })
    ws.processStream[req.workId].on('finish', () => {
      ws.send(JSON.stringify({type: 'processstdout', data: {id: req.workId, process: 'WORK_END_FLAG'}}))
      ws.processStream[req.workId] = new stream.PassThrough()
    })
  }
}

module.exports = WebsocketController
