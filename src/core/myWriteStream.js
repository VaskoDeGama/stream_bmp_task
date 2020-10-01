const { Writable } = require('stream')

class MyWriteStream extends Writable {
  constructor (options) {
    super(options)
    this.result = []
    this.buffer = []
  }

  _write (chunk, encoding, next) {
    if (chunk.toString() === '___END___') {
      if (this.buffer.length > 0) {
        this.result.push(this.buffer)
        console.log('Pushed to result:', this.buffer)
        this.buffer = []
      }
    } else {
      const parsedChunk = [...chunk.values()]

      console.log('Received:', parsedChunk)

      if (this.buffer.length < 10) {
        if (this.buffer.length + parsedChunk.length > 10) {
          const excess = parsedChunk.splice(10 - this.buffer.length, parsedChunk.length)

          this.buffer.push(...parsedChunk)
          this.result.push(this.buffer)
          console.log('Pushed to result:', this.buffer)
          this.buffer = []
          this.buffer.push(...excess)
        } else {
          this.buffer.push(...parsedChunk)
        }
      } else {
        this.result.push(this.buffer)
        this.buffer = []
      }
    }

    next()
  }

  getResult () {
    return this.result
  }
}

module.exports = MyWriteStream
