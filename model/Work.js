const fs = require('fs')
const rimraf = require("rimraf")
const { COPYFILE_FICLONE } = fs.constants
const Model = require('./Model')
class Work extends Model {
  constructor (db) {
    let table = 'work'
    let construction =  {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      JT_id: 'INTEGER',
      name: 'TEXT',
      describe: 'TEXT',
      isalive: 'INTEGER',
      param: 'TEXT',
      remote: 'TEXT',
      file: 'TEXT'
    }
    super(db, table, construction)
  }
  async Create (data) {
    if (!data || typeof data !== 'object') { return this.HandleError('no data or wrong type data') }
    let jtData = (await this.db.Select('jmeter', [{key: 'id', value: data.JT_id}]))[0]
    if (!jtData) {
      return this.HandleError('選擇的Jmeter檔案不存在，請重新操作')
    }
    let ret = await this.db.Insert(this.table, data)
    if (!ret) {
      return this.HandleError(ret)
    } else {
      if (jtData.file) {
        let srcPath = `${__dirname}/../warehouse/jmx/${jtData.id}_${jtData.file}`
        let destPath = `${__dirname}/../work/${ret.lastID}/${jtData.file}`
        fs.stat(`${__dirname}/../work/${ret.lastID}`, (error, stats) => {
          if (!stats) {
            fs.mkdir(`${__dirname}/../work/${ret.lastID}`, { recursive: true }, (error) => {
              if (error) console.error(error)
              fs.copyFile(srcPath, destPath, COPYFILE_FICLONE, (error) => { if (error) console.log(error) })
            })
          } else {
            fs.copyFile(srcPath, destPath, COPYFILE_FICLONE, (error) => { if (error) console.log(error) })
          }
        })
      }
      return this.HandleSuccess(ret)
    }
  }
  async Delete (where) {
    if (!where) { return this.HandleError('no where') }
    let oldData = (await this.db.Select(this.table, where))[0]
    let workPath = `${__dirname}/../work/${oldData.id}`
    let ret = await this.db.Delete(this.table, where)
    if (!ret) {
      return this.HandleError(ret)
    } else {
      await rimraf(workPath, (err) => {
        if (err) console.error(err)
      })
      return this.HandleSuccess(ret)
    }
  }
}

module.exports = Work
