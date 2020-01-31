var get = (db, query, params) => {
  return new Promise(function(resolve, reject) {
    if(params == undefined) params = []
    db.get(query, params, function(err, row) {
      if(err) reject("Sqlite Get error: " + err.message)
      else  resolve(row)
    })
  })
}

module.exports = get
