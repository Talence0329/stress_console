var run = require('../sqlite').run
var { GenerateWhere } =require('./Tool')
/**
 * 更新資料
 * @param db sqlite3.Database
 * @param {String} table 資料表名稱
 * @param {{Column: String...}} data 欲新增的資料 {Column: Value...}
 * @param {[{type: string, key: string, value: string}]} where 查詢條件 [{type: 'and', key: 'id', value: '2'}, [{}...]] 巢狀陣列會以括號包含
 * @returns {Boolean} 執行結果
 */
module.exports = async (db, table, data, where = []) => {
  var setString = ''
  var searchString = GenerateWhere(where)

  Object.keys(data).forEach((column, index) => {
    let value = data[column]
    setString += column + ' = \'' + value + '\'' + (index != Object.keys(data).length - 1 ? ', ' : '')
  })

  let sql = 'UPDATE ' + table + ' SET ' + setString + ' WHERE ' + searchString
  let result = false
  try {
    result = await run(db, sql)
  } catch (error) {
    console.log(error)
  }

  return result
}
