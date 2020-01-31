module.exports = {
  /**
   * 產生欄位字串
   * @param {String[] | String} column 欄位或欄位陣列
   * @returns {String | Boolean} 回傳欄位字串 當格式有問題的時候回傳 *
   */
  GenerateColumn: (column = '*') => {
    if (!Array.isArray(column)) { return (typeof column == 'string' && column.length !== 0 ? column : '*') }
    let colStr = ''
    try {
      column.forEach((element, index) => {
        colStr += element + (index !== column.length ? ',' : '')
      })
    } catch (error) {
      console.error(error)
      colStr = false
    }

    return colStr
  },
  /**
   * 產生查詢字串
   * @param {[{type: string, key: string, value: string}]} where 查詢條件 [{type: 'and', key: 'id', value: '2'}, [{}...]] 巢狀陣列會以括號包含
   * @returns {String | Boolean}查詢字串
   */
  GenerateWhere: (where = []) => {
    if (!Array.isArray(where)) { return '' }
    let whereStr = ''
    try {
      where.forEach(element => {
        if (typeof element === 'object' && !Array.isArray(element)) {
          if (whereStr !== '') { whereStr += element.type ? (' ' + element.type + ' ') : ' and '}
          if (element.like) {
            whereStr += element.key + ' like "%' + element.value + '%"'
          } else {
            whereStr += element.key + ' = "' + element.value + '"'
          }
        } else if (Array.isArray(element)) {
          if (whereStr !== '') { whereStr += element[0].type ? (' ' +  element[0].type + ' ') : ' and ' }
          whereStr += ' (' + GenerateWhere(element) + ') '
        }
      })
    } catch (error) {
      console.error(error)
      whereStr = false
    }

    return whereStr
  }
}
