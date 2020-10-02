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

    this.offset = null
    this.rowSize = null
    this.fillingBytes = null
    this.itFirstPackage = true

    this.buffer = null
  }

  /**
   * Main transform function
   * @param {Buffer} chunk - data part
   * @param {BufferEncoding} encoding - data encoding
   * @param {function} next - callback
   * @private
   */
  _transform (chunk, encoding, next) {
    if (this.itFirstPackage) {
      try {
        const header = this.parseHeader(chunk)

        this.push(header)
      } catch (e) {
        return next(e)
      }

      const imageBuffer = chunk.slice(this.offset)

      this.transformChunk(imageBuffer, this.rowSize, this.fillingBytes)
      this.itFirstPackage = false

      return next()
    }

    if (this.buffer.length > 0) {
      chunk = this.bufferProcessing(chunk)
    }

    this.transformChunk(chunk, this.rowSize, this.fillingBytes)

    next()
  }

  /**
   * Parse need data from first chunk
   * @param {Buffer} chunk - first chunk
   * @param {number} headerSize - optional header length parameter
   * @returns {Buffer}
   */
  parseHeader (chunk, headerSize = 14) {
    try {
      const { offset } = decodeFileHeader(chunk.slice(0, headerSize))
      const dibHeaderSize = chunk.readUInt32LE(headerSize)
      const dibHeader = decodeDIBHeader(chunk.slice(headerSize, dibHeaderSize))
      const { rowSize, fillingBytes } = getRowInfo(dibHeader.imageSize, dibHeader.height, dibHeader.width)

      const header = chunk.slice(0, offset)

      this.offset = offset
      this.rowSize = rowSize
      this.fillingBytes = fillingBytes

      return header
    } catch (e) {
      throw e
    }
  }

  /**
   * Fill buffer from chunk and push this
   * @param {Buffer} chunk - received chunk
   * @returns {Buffer} - link on the rest of the chunk
   */
  bufferProcessing (chunk) {
    const needFilling = this.rowSize - this.buffer.length
    const filler = chunk.slice(0, needFilling)
    const row = Buffer.concat([this.buffer, filler], this.rowSize)

    this.buffer = null
    this.flipAndPush(row, 1, this.rowSize, this.fillingBytes)
    return chunk.slice(needFilling)
  }

  /**
   * Processed Chunk
   * @param {Buffer} imageBuffer - chunk part
   * @param {number} rowSize - row size in bytes
   * @param {number} fillingBytes - count of filling bytes
   */
  transformChunk (imageBuffer, rowSize, fillingBytes) {
    const rows = Math.floor(imageBuffer.length / this.rowSize)

    this.saveNotFullRow(imageBuffer, rows, rowSize)
    this.flipAndPush(imageBuffer, rows, rowSize, fillingBytes)
  }

  /**
   *
   * @param {Buffer} imgBuffer - chunk part
   * @param {number} rows - rows count
   * @param {number} rowSize - row size in bytes
   * @param {number} fillingBytes - count of filling bytes
   */
  flipAndPush (imgBuffer, rows, rowSize, fillingBytes) {
    for (let i = 0; i < rows; i += 1) {
      const row = imgBuffer.slice(i * rowSize, (i + 1) * rowSize)

      const flipPart = row.slice(0, rowSize - fillingBytes)

      flipRow(flipPart)

      this.push(row)
    }
  }

  /**
   * Save to buffer image part there not full row
   * @param {Buffer} imgBuffer - chunk part
   * @param {number} rows - rows count
   * @param {number} rowSize - row size in bytes
   */
  saveNotFullRow (imgBuffer, rows, rowSize) {
    this.buffer = Buffer.alloc(imgBuffer.length - (rowSize * rows))
    imgBuffer.copy(this.buffer, 0, rowSize * rows, imgBuffer.length)
  }
}

module.exports = MirrorStream
