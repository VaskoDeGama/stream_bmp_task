const { Transform } = require('stream')

class MirrorStream extends Transform {
  constructor() {
    super()
  }

  _transform(chunk, encoding, cb) {
    chunk.write(chunk.toString().toUpperCase())
    console.log(chunk.toString())
    cb(null, chunk)
  }

}

module.exports = MirrorStream