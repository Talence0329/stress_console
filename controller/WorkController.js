const rimraf = require("rimraf")
const Kill = require('tree-kill')
var { DoWork } = require('../work/executor')
var { waitUntil } = require('../tools')
class WorkController {
  constructor (db) {
    this.db = db
    this.Work = new (require('../model').Work)(this.db)
    this.process = {}
    this.processStream = {}
  }
  HandleRequest (req) {
    console.log(req.body)
    switch (req.body.do) {
      case 'list':
        return this.List(req.body)
      case 'get':
        return this.Get(req.body)
      case 'create':
        return this.Create(req.body)
      case 'update':
        return this.Edit(req.body)
      case 'delete':
        return this.Delete(req.body)
      case 'excute':
        return this.Excute(req.body)
      case 'stop':
        return this.Stop(req.body)
      default:
        console.error('unknow do')
        return 'unknow do'
    }
  }
  async List (req) {
    let where, column
    if (req.data) {
      where = req.data.where ? req.data.where : ''
      column = req.data.column ? req.data.column : ''
    }
    return await this.Work.List(where, column)
  }
  async Get (req) {
    let where, column
    if (req.data) {
      where = req.data.where ? req.data.where : ''
      column = req.data.column ? req.data.column : ''
    }
    return await this.Work.Get(where, column)
  }
  async Create (req) {
    return await this.Work.Create(req.data)
  }
  async Edit (req) {
    let data = req.data
    let where = [{key: 'id', value: data.id}]
    return await this.Jmeter.Update(data, where)
  }
  async Delete (req) {
    let where = req.where
    return await this.Work.Delete(where)
  }
  async Excute (req) {
    if (!req.where) { return this.HandleError('missing where') }
    let where = req.where ? req.where : ''
    let work = await this.Work.Get(where)
    let thisobj = this
    if (!work.status) { return work }
    if (!work.data.file) {
      return this.HandleError('缺少檔案')
    } else {
      if (this.process[work.data.id]) {
        return this.HandleError('work:' + work.data.id + ' 已在執行中')
      }
      let path = __dirname + '/../work/' + work.data.id + '/' + work.data.file
      let reportPath = __dirname + '/../warehouse/report/' + work.data.id
      let params = JSON.parse(work.data.param)
      let paramArray = ['-n', '-t', path, '-l', `${reportPath}/${work.data.id + '_report'}`, '-e', '-o', reportPath]
      params.forEach(element => {
        paramArray.push(`-J${element.key}=${element.value}`)
      })
      paramArray.push(`-JlogPath='warehouse/report/${work.data.id}'`)
      await rimraf(reportPath, async (err) => {
        if (err) console.error(err)
        let process = DoWork('jmeter', paramArray, async () => {
          await thisobj.Work.Update({isalive: 0}, where)
          delete thisobj.process[work.data.id]
        })
        thisobj.process[work.data.id] = process
        await thisobj.Work.Update({isalive: 1}, where)
      })
      await waitUntil(() => {
        return this.process[work.data.id] !== undefined
      }, 5000, 100, 'process not on')
      return this.HandleSuccess(true)
    }
  }
  async Stop (req) {
    let result = false
    if (this.process[req.id]) {
      Kill(this.process[req.id].pid)
      result = this.process[req.id].killed
      delete this.processStream[req.id]
    }
    await this.Work.Update({isalive: 0}, [{key: 'id', value: req.id}])
    return this.HandleSuccess(result)
  }
  HandleSuccess (data) {
    if (data && data !== true) return { status: true, data: data }
    return { status: true, message: 'OK' }
  }
  HandleError (msg) {
    return { status: false, message: msg }
  }
}

module.exports = WorkController
