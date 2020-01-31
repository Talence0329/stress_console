var run = require('../sqlite').run
/**
 * 執行SQL指令
 * @param db sqlite3.Database
 * @param {String} sql SQL指令
 * @returns {Boolean} 回傳結果 true/false
 */
module.exports = async (db, sql = '') => {
  if (sql == '') return false
  let result = false
  try {
    result = await run(db, sql)
  } catch (error) {
    console.log(error)
  }

  return result
}
