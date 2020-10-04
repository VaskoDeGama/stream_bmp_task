const { Transform } = require('stream')
const { decodeFileHeader, decodeDIBHeader, getRowInfo, flipRow } = require('./convert')

/**
 * Transform stream class
 * @class
 * @classdesc transform stream for flipping image
 */
class MirrorStream extends Transform {
  /**
   * Transform stream constructor, preparing private variables for work
   * @param {Object} options -  stream options
   */
  constructor (options) {
    super(options)
    this.buffer = Buffer.alloc(200, '00', 'hex')
  }

  /**
   * Main transform function
   * @param {Buffer} chunk - data part
   * @param {BufferEncoding} encoding - data encoding
   * @param {function} next - callback
   * @private
   */
  _transform (chunk, encoding, next) {
    try {
      const header = decodeFileHeader(chunk)

      console.log(header)
    } catch (e) {
      return next(e)
    }

    next(null, chunk)
  }
}

module.exports = MirrorStream
