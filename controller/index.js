let env = require('../env')
let Database = require('../database')
let db = new Database(env.database)

module.exports = {
  SystemController: new (require('./SystemController'))(),
  WebsocketController: require('./WebsocketController'),
  JmeterController: new (require('./JmeterController'))(db),
  WorkController: new (require('./WorkController'))(db)
}