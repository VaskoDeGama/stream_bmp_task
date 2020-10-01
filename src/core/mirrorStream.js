const { Transform } = require('stream')

class MirrorStream extends Transform {
  constructor () {
    super()
    this.memory = []
  }

  _transform (chunk, encoding, cb) {
    console.log(`Transform: ${chunk.toString()} to ${chunk.toString().toUpperCase()}`)
    chunk.write(chunk.toString().toUpperCase())
    cb(null, chunk)
  }
}

module.exports = MirrorStream
