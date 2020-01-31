const rimraf = require("rimraf")
var shell = require('shelljs')
class JmeterController {
  constructor (db) {
    this.db = db
    this.Jmeter = new (require('../model').Jmeter)(this.db)
  }
  HandleRequest (req) {
    console.log(req.body)
    switch (req.body.do) {
      case 'list':
        return this.List(req.body)
      case 'get':
        return this.Get(req.body)
      case 'create':
        return this.Create(req)
      case 'update':
        return this.Edit(req)
      case 'delete':
        return this.Delete(req.body)
      case 'excute':
        return this.Excute(req.body)
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
    return await this.Jmeter.List(where, column)
  }
  async Get (req) {
    let where, column
    if (req.data) {
      where = req.data.where ? req.data.where : ''
      column = req.data.column ? req.data.column : ''
    }
    return await this.Jmeter.Get(where, column)
  }
  async Create (req) {
    let file = req.files !== null ? req.files.file : false
    return await this.Jmeter.Create(JSON.parse(req.body.data), file)
  }
  async Edit (req) {
    let data = JSON.parse(req.body.data)
    let where = [{key: 'id', value: data.id}]
    let file = req.files !== null ? req.files.file : false
    return await this.Jmeter.Update(data, where, file)
  }
  async Delete (req) {
    let where = req.where
    return await this.Jmeter.Delete(where)
  }
  async Excute (req) {
    if (!req.where) { return this.HandleError('missing where') }
    let where = req.where ? req.where : ''
    let data = await this.Jmeter.Get(where)
    if (!data.status) { return data }
    if (!data.data.file) {
      return this.HandleError('lack of file')
    } else {
      let path = __dirname + '/../warehouse/jmx/' + data.data.id + '_' + data.data.file
      let reportPath = __dirname + '/../warehouse/report/' + data.data.id + '_' + data.data.file.split('.')[0]
      let params = JSON.parse(data.data.param)
      let paramString = ''
      params.forEach(element => {
        paramString += `-J${element.key}=${element.value} `
      })
      if (paramString.indexOf('logPath') == -1) { paramString += `-JlogPath='warehouse/report/${data.data.id}_${data.data.file.split('.')[0]}'` }
      let command = `jmeter -n -t ${path} -l ${reportPath}/${data.data.id + '_report'} -e -o ${reportPath} ${paramString}`
      await rimraf(reportPath, (err) => {
        if (err) console.error(err)
        shell.exec(command)
      })
      return this.HandleSuccess(true)
    }
  }
  HandleSuccess (data) {
    if (data && data !== true) return { status: true, data: data }
    return { status: true, message: 'OK' }
  }
  HandleError (msg) {
    return { status: false, message: msg }
  }
}

module.exports = JmeterController
