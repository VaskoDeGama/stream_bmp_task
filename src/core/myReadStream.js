const { Readable } = require('stream')

class MyReadStream extends Readable {
  constructor (options, max) {
    super(options)

    this._max = max
    this._idx = 0
    this.memory = []
  }

  _read (size) {
    this._idx += 1

    if (this._idx <= this._max) {
      setTimeout(() => {
        const str = `${this._idx} package of ${this._max}`

        const buf = Buffer.from(str)

        console.log(`Read: ${buf.toString()}`)
        this.memory.push(str.toUpperCase())
        this.push(buf)
      }, 2000)
    } else {
      this.push(null)
    }
  }

  getMemory () {
    return this.memory
  }
}

module.exports = MyReadStream
