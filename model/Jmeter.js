const fs = require('fs')
const Model = require('./Model')
class Jmeter extends Model {
  constructor (db) {
    let table = 'jmeter'
    let construction =  {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      PJ_id: 'INTEGER',
      name: 'TEXT',
      describe: 'TEXT',
      param: 'TEXT',
      remote: 'TEXT',
      file: 'TEXT'
    }
    super(db, table, construction)
  }
  async Create (data, file = {}) {
    if (!data || typeof data !== 'object') { return this.HandleError('no data or wrong type data') }
    if (file) {
      data.file = file.name
    }
    let ret = await this.db.Insert(this.table, data)
    if (!ret) {
      return this.HandleError(ret)
    } else {
      if (file) {
        file.mv(__dirname + '/../warehouse/jmx/' + ret.lastID + '_' + file.name)
      }
      return this.HandleSuccess(ret)
    }
  }
  async Update (data, where, file = {}) {
    if (!data) { return this.HandleError('no data') }
    if (!where) { return this.HandleError('no where') }
    let oldData = (await this.db.Select(this.table, where))[0]
    // 有新檔案的話要砍舊檔案
    if (file) {
      data.file = file.name
      if (oldData.file) {
        fs.unlink(__dirname + '/../warehouse/jmx/' + oldData.id + '_' + oldData.file, (err) => { if (err) console.error(err) })
      }
    }
    let ret = await this.db.Update(this.table, data, where)
    if (!ret) { return this.HandleError(ret) } else {
      if (file) {
        file.mv(__dirname + '/../warehouse/jmx/' + data.id + '_' + file.name)
      }
      return this.HandleSuccess(ret)
    }
  }
  async Delete (where) {
    if (!where) { return this.HandleError('no where') }
    let oldData = (await this.db.Select(this.table, where))[0]
    // 有檔案的話要砍掉檔案
    if (oldData.file) {
      fs.unlink(__dirname + '/../warehouse/jmx/' + oldData.id + '_' + oldData.file, (err) => { if (err) console.error(err) })
    }
    let ret = await this.db.Delete(this.table, where)
    if (!ret) {
      return this.HandleError(ret)
    } else {
      return this.HandleSuccess(ret)
    }
  }
}

module.exports = Jmeter
