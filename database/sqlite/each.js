var each = (db, query, params, action) => {
  return new Promise(function(resolve, reject) {
    db.serialize(function() {
      db.each(query, params, function(err, row)  {
        if(err) reject("Read error: " + err.message)
        else {
          if(row) {
            action(row)
          }    
        }
      })
      db.get("", function(err, row)  {
        resolve(true)
      })            
    })
  }) 
}

module.exports = each
