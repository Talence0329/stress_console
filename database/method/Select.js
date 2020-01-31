var all = require('../sqlite').all
var { GenerateColumn, GenerateWhere } =require('./Tool')
/**
 * 取得資料
 * @param db sqlite3.Database
 * @param {String} table 資料表名稱
 * @param {[{type: string, key: string, value: string}]} where 查詢條件 [{type: 'and', key: 'id', value: '2'}, [{}...]] 巢狀陣列會以括號包含
 * @param {String[] | String} column 欄位或欄位陣列
 * @returns {Object[] | Boolean} 取得資料或是失敗回傳false
 */
module.exports = async (db, table, where = [], column = '*') => {
  var searchString = GenerateWhere(where)
  var columnString = GenerateColumn(column)
  let sql = 'SELECT ' + columnString + ' FROM ' + table + ( searchString !== ''  ? ' WHERE ' + searchString : '')

  let result = await all(db, sql)
  return result
}
