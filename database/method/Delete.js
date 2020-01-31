var run = require('../sqlite').run
var { GenerateWhere } =require('./Tool')
/**
 * 刪除一筆資料
 * @param db sqlite3.Database
 * @param {String} table 資料表名稱
 * @param {[{type: string, key: string, value: string}]} where 查詢條件 [{type: 'and', key: 'id', value: '2'}, [{}...]] 巢狀陣列會以括號包含
 * @returns {Boolean} 執行結果
 */
module.exports = async (db, table, where) => {
  var searchString = GenerateWhere(where)

  let sql = 'DELETE FROM ' + table + ' WHERE ' + searchString
  let result = false
  try {
    result = await run(db, sql)
  } catch (error) {
    console.log(error)
  }

  return result
}
