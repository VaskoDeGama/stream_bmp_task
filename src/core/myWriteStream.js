const { Writable } = require('stream')

class MyWriteStream extends Writable {
  constructor (options) {
    super(options)
    this.memory = []
  }

  _write (chunk, encoding, callback) {
    console.log(`Write:`, chunk.toString())
    this.memory.push(chunk.toString())
    callback()
  }

  getMemory () {
    return this.memory
  }
}

module.exports = MyWriteStream
