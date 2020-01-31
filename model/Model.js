class Model {
  constructor (db, table, construction) {
    this.db = db
    this.table = table
    this.construction = construction
    this.db.CheckTable(this.table).then((ret) => {
      if (!ret) {
        this.Construct(construction)
      }
    })
  }
  Construct (construction) {
    let constString = ''
    Object.keys(construction).forEach((element, index) => {
      constString += element + ' ' + construction[element] + (index !== Object.keys(construction).length - 1 ? ',' : '')
    })
    if (constString !== '')
      this.db.Setup(this.table, constString)
    else
      console.error('no const string')
  }
  async List (where, column) {
    let ret = await this.db.Select(this.table, where, column)
    if (!ret) {
      return this.HandleError(ret)
    } else {
      return this.HandleSuccess(ret)
    }
  }
  async Get (where, column) {
    let ret = await this.db.Select(this.table, where, column)
    if (!ret) {
      return this.HandleError(ret)
    } else {
      return this.HandleSuccess(ret[0])
    }
  }
  async Create (data) {
    if (!data || typeof data !== 'object') { return this.HandleError('no data or wrong type data') }
    let ret = await this.db.Insert(this.table, data)
    if (!ret) {
      return this.HandleError(ret)
    } else {
      return this.HandleSuccess(ret)
    }
  }
  async Update (data, where) {
    if (!data) { return this.HandleError('no data') }
    if (!where) { return this.HandleError('no where') }
    let ret = await this.db.Update(this.table, data, where)
    if (!ret) {
      return this.HandleError(ret)
    } else {
      return this.HandleSuccess(ret)
    }
  }
  async Delete (where) {
    if (!where) { return this.HandleError('no where') }
    let ret = await this.db.Delete(this.table, where)
    if (!ret) {
      return this.HandleError(ret)
    } else {
      return this.HandleSuccess(ret)
    }
  }
  HandleSuccess (data) {
    if (data && data !== true) return { status: true, data: data }
    return { status: true, message: 'OK' }
  }
  HandleError (msg) {
    return { status: false, message: msg }
  }
}

module.exports = Model
