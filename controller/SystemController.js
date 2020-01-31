const os = require('os-utils')
class SystemController {
  constructor () {
    this.recordInterval = 1000
    this.maxRecord = 604800 // 一週的紀錄量
    this.record = []
    this.currentRecord = {}
    this.Recorder()
  }
  async Recorder () {
    let thisobj = this
    let recorder = setInterval(async () => {
      if (this.record.length >= this.maxRecord)
        this.record.splice(0, 1)
      os.cpuUsage(function (v) {
        thisobj.currentRecord = {time: new Date(), cpu: Math.round(v * 10000) / 100, freemem: os.freemem(), memory: os.totalmem()}
        thisobj.record.push(thisobj.currentRecord)
      })
    }, 1000)
  }
}

module.exports = SystemController
