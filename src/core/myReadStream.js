const { Readable } = require('stream')

class MyReadStream extends Readable {
  constructor (arrayOfData, options) {
    super(options)
    this.arrayOfData = arrayOfData
    this._idx = 0
  }

  _read (size) {
    if (this._idx < this.arrayOfData.length) {
      setTimeout(() => {
        const chunk = this.arrayOfData.slice(this._idx, this._idx + 3)
        const buf = Buffer.from(chunk)

        this._idx += size
        this.push(buf)
      }, 1000)
    } else {
      this.push(null)
    }
  }

  getMemory () {
    return this.memory
  }
}

module.exports = MyReadStream
