let sqlite3 = require('sqlite3').verbose()
let { Select, Insert, Update, Delete, Excute } = require('./method')

class Database {
  constructor (Database = ':memory:') {
    this.db = new sqlite3.Database(Database)
  }
  Setup (table, columSetting) {
    let thisobj = this
    return new Promise(function(resolve, reject) {
      thisobj.db.serialize(() => {
        thisobj.db.run('CREATE TABLE IF NOT EXISTS ' + table + ' ( ' + columSetting + ' )', (err) => {
          if (err) reject(err)
        })
        thisobj.db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="' + table + '"', (err, row) => {
          if (err) reject(err)
          if (row) resolve(true)
          else resolve(false)
        })
      })
    }).then((ret) => {
      return ret
    }).catch((error) => {
      console.error(error)
      return false
    })
  }
  CheckTable (table) {
    let thisobj = this
    return new Promise((resolve, reject) => {
      thisobj.db.serialize(() => {
        thisobj.db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="' + table + '"', (err, row) => {
          if (err) reject(err)
          if (row) resolve(true)
          else resolve(false)
        })
      })
    }).then((ret) => {
      return ret
    }).catch((error) => {
      console.error(error)
      return false
    })
  }
  Select (table, where = '', column = '*') {
    let thisobj = this
    return new Promise(async (resolve, reject) => {
      try {
        let data = await Select(thisobj.db, table, where, column)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }).then((ret) => {
      return ret
    }).catch((error) => {
      console.error(error)
      return false
    })
  }
  Insert (table, data) {
    let thisobj = this
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await Insert(thisobj.db, table, data))
      } catch (error) {
        reject(error)
      }
    }).then(async (ret) => {
      return ret
    }).catch((error) => {
      console.error(error)
      return false
    })
  }
  Update (table, data, where = '') {
    let thisobj = this
    return new Promise(async (resolve, reject) => {
      try {
        let result = await Update(thisobj.db, table, data, where)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }).then((ret) => {
      return ret
    }).catch((error) => {
      console.error(error)
      return false
    })
  }
  Delete (table, where = '') {
    let thisobj = this
    return new Promise(async (resolve, reject) => {
      try {
        if (where == '') { reject(Error('No where')) }
        let result = await Delete(thisobj.db, table, where)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }).then((ret) => {
      return ret
    }).catch((error) => {
      console.error(error)
      return false
    })
  }
  Excute (sql = '') {
    let thisobj = this
    return new Promise(async (resolve, reject) => {
      try {
        let result = await Excute(thisobj.db, sql)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }).then((ret) => {
      return ret
    }).catch((error) => {
      console.error(error)
      return false
    })
  }
}

module.exports = Database
