var run = (db, query) => {
  return new Promise(function(resolve, reject) {
    db.run(query,
      function(err) {
        if(err) reject(err.message)
        else  resolve(true)
    })
  })
}

module.exports = run
