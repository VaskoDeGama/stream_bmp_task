const { Writable } = require('stream')

class MyWriteStream extends Writable {
  constructor (options) {
    super(options)
    this.result = []
    this.buffer = []
  }

  _write (chunk, encoding, next) {
    const parsedChunk = [...chunk.values()]

    if (this.buffer.length < 10) {
      if (this.buffer.length + parsedChunk.length > 10) {
        const excess = parsedChunk.splice(10 - this.buffer.length, parsedChunk.length)

        this.buffer.push(...parsedChunk)
        this.result.push(this.buffer)
        this.buffer = []
        this.buffer.push(...excess)
      } else {
        this.buffer.push(...parsedChunk)
      }
    } else {
      this.result.push(this.buffer)
      this.buffer = []
    }

    next()
  }

  _final (callback) {
    if (this.buffer.length > 0) {
      this.result.push(this.buffer)
      this.buffer = []
    }
  }

  getResult () {
    return this.result
  }
}

module.exports = MyWriteStream
