var { run, get } = require('../sqlite')
/**
 * 新增一筆資料
 * @param db sqlite3.Database
 * @param {String} table 資料表名稱
 * @param {{Column: String...}} data 欲新增的資料 {Column: Value...}
 * @returns {Boolean} 執行結果
 */
module.exports = async (db, table, data) => {
  var columns = ''
  var values = ''
  Object.keys(data).forEach((column, index) => {
    let value = data[column]
    columns += column + (index != Object.keys(data).length - 1 ? ',' : '')
    values += '\'' + value +  '\'' + (index != Object.keys(data).length - 1 ? ', ' : '')
  })
  
  let sql = 'INSERT INTO ' + table + ' (' + columns + ') VALUES ' + '(' + values + ')'
  let result = await run(db, sql)
  if (result == true) { result = await get(db, 'SELECT last_insert_rowid() as lastID') }
  return result
}