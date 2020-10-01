const { Transform } = require('stream')

class MirrorStream extends Transform {
  constructor () {
    super()
    this.memory = []
  }

  _transform (chunk, encoding, cb) {
    cb(null, chunk)
  }
}

module.exports = MirrorStream
