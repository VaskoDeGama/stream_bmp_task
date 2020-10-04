const { Transform } = require('stream')
const { decodeFileHeader, decodeDIBHeader, getRowInfo, flipRow } = require('./convert')
const FILE_HEADER_SIZE = 14

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
    this.buffer = Buffer.alloc(0)
    this.bufferSize = 138
    this.firstBigChunk = true
  }

  /**
   * Main transform function
   * @param {Buffer} chunk - data part
   * @param {BufferEncoding} encoding - data encoding
   * @param {function} next - callback
   * @private
   */
  _transform (chunk, encoding, next) {
    if (this.buffer.length < this.bufferSize && chunk.length < this.bufferSize) {
      this.buffer = Buffer.concat([this.buffer, chunk])
      return next()
    }

    const bigChunk = Buffer.concat([this.buffer, chunk])

    this.buffer = Buffer.alloc(0)

    if (this.firstBigChunk) {
      try {
        const { offset } = decodeFileHeader(bigChunk.slice(0, FILE_HEADER_SIZE))
        const dibHeaderSize = bigChunk.readInt32LE(FILE_HEADER_SIZE)
        const { imageSize, height, width } = decodeDIBHeader(bigChunk.slice(FILE_HEADER_SIZE, dibHeaderSize + FILE_HEADER_SIZE))
        const { rowSize, fillingBytes } = getRowInfo(imageSize, height, width)

        const header = bigChunk.slice(0, offset)

        if (bigChunk.length - header.length > 0) {
          this.saveRemainingBytes(bigChunk, header)
        }

        this.rowSize = rowSize
        this.fillingBytes = fillingBytes
        this.bufferSize = rowSize
        this.firstBigChunk = false

        return next(null, header)
      } catch (error) {
        return next(error)
      }
    }

    const transformedData = this.transformData(bigChunk)

    this.saveRemainingBytes(bigChunk, transformedData)

    next(null, transformedData)
  }

  /**
   * Transform last part of data
   * @param {function} next
   * @private
   */
  _flush (next) {
    if (this.buffer.length > 0) {
      const transformedData = this.transformData(this.buffer)

      return next(null, transformedData)
    }

    next()
  }

  /**
   * Save remaining bytes to buffer
   * @param {Buffer} rawData - received chunks
   * @param {Buffer} transformedData - transformed part of received chunks
   */
  saveRemainingBytes (rawData, transformedData) {
    const remainingBytes = rawData.slice(transformedData.length, rawData.length)

    this.buffer = Buffer.concat([this.buffer, remainingBytes])
  }

  /**
   * Flip received pixel array by rows and return link on transformed part
   * @param {Buffer} data - buffer with pixel array
   * @returns {Buffer} transformed part of pixel array
   */
  transformData (data) {
    const rows = Math.floor(data.length / this.rowSize)

    for (let i = 0; i < rows; i += 1) {
      const row = data.slice(i * this.rowSize, (i + 1) * this.rowSize)
      const flippableRow = row.slice(0, row.length - this.fillingBytes)

      flipRow(flippableRow)
    }

    return data.slice(0, rows * this.rowSize)
  }
}

module.exports = MirrorStream
