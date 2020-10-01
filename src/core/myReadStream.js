const { Readable } = require('stream')

const bigArray = Array.from({ length: 10 }, (v, k) => k + 1)

class MyReadStream extends Readable {
  constructor (options) {
    super(options)
    this._idx = 0
  }

  _read (size) {
    if (this._idx < bigArray.length) {
      setTimeout(() => {
        const chunk = bigArray.slice(this._idx, this._idx + 3)
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
