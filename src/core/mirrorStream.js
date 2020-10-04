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
        const fileHeader = decodeFileHeader(bigChunk.slice(0, FILE_HEADER_SIZE))
        const dibHeaderSize = bigChunk.readInt32LE(FILE_HEADER_SIZE)
        const dibHeader = decodeDIBHeader(bigChunk.slice(FILE_HEADER_SIZE, dibHeaderSize + FILE_HEADER_SIZE))
        const rowInfo = getRowInfo(dibHeader.imageSize, dibHeader.height, dibHeader.width)

        console.log(rowInfo, dibHeader, fileHeader)

        const header = bigChunk.slice(0, fileHeader.offset)

        if (bigChunk.length - header.length > 0) {
          const remainingBytes = bigChunk.slice(header.length, bigChunk.length)

          this.buffer = Buffer.concat([this.buffer, remainingBytes])
        }

        this.rowSize = rowInfo.rowSize
        this.fillingBytes = rowInfo.fillingBytes
        this.bufferSize = rowInfo.rowSize
        this.firstBigChunk = false

        return next(null, header)
      } catch (error) {
        return next(error)
      }
    }

    const rows = Math.floor(bigChunk.length / this.rowSize)

    for (let i = 0; i < rows; i += 1) {
      const row = bigChunk.slice(i * this.rowSize, (i + 1) * this.rowSize)
      const flippableRow = row.slice(0, row.length - this.fillingBytes)

      flipRow(flippableRow)
      this.push(row)
    }

    const remainingBytes = bigChunk.slice(this.rowSize * rows, bigChunk.length)

    this.buffer = Buffer.concat([this.buffer, remainingBytes])

    next()
  }

  _flush (next) {
    if (this.buffer.length > 0) {
      const rows = Math.floor(this.buffer.length / this.rowSize)

      for (let i = 0; i < rows; i += 1) {
        const row = this.buffer.slice(i * this.rowSize, (i + 1) * this.rowSize)
        const flippableRow = row.slice(0, row.length - this.fillingBytes)

        flipRow(flippableRow)
        this.push(row)
      }
    }

    next()
  }
}

module.exports = MirrorStream
