const { Writable } = require('stream')

class MyWriteStream extends Writable {
  constructor (options) {
    super(options)
    this.memory = []
  }

  _write (chunk, encoding, callback) {
    this.memory.push([...chunk.values()])

    callback()
  }

  getMemory () {
    return this.memory
  }
}

module.exports = MyWriteStream
