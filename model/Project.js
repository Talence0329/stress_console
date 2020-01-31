const Model = require('./Model')
class Project extends Model {
  constructor (db) {
    let table = 'jmeter'
    let construction =  {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT'
    }
    super(db, table, construction)
  }
}

module.exports = Project
