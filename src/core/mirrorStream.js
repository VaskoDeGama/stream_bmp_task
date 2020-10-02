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

    this.fileHeader = null
    this.dibHeader = null
    this.rowSize = null
    this.fillingBytes = null
    this.itFirstPackage = true

    this.buffer = null
  }

  /**
   * Main transform function
   * @param {Buffer} chunk - data part
   * @param {string} encoding - data encoding
   * @param {function} next - callback
   * @private
   */
  _transform (chunk, encoding, next) {
    if (this.itFirstPackage) {
      try {
        this.fileHeader = decodeFileHeader(chunk.slice(0, 14))
      } catch (e) {
        return next(e)
      }

      const dibHeaderSize = chunk.readUInt32LE(14)

      this.dibHeader = decodeDIBHeader(chunk.slice(14, dibHeaderSize))

      const { rowSize, fillingBytes } = getRowInfo(this.dibHeader.imageSize, this.dibHeader.height, this.dibHeader.width)

      this.rowSize = rowSize
      this.fillingBytes = fillingBytes

      const header = chunk.slice(0, this.fileHeader.offset)

      this.push(header)

      const imageBuffer = chunk.slice(this.fileHeader.offset)

      this.itFirstPackage = false

      const rows = Math.floor(imageBuffer.length / this.rowSize)

      this.saveNotFullRow(imageBuffer, rows, rowSize)
      this.flipAndPush(imageBuffer, rows, rowSize, fillingBytes)
      return next()
    }

    if (this.buffer.length > 0) {
      const needFilling = this.rowSize - this.buffer.length
      const filler = chunk.slice(0, needFilling)
      const row = Buffer.concat([this.buffer, filler], this.rowSize)

      this.buffer = null
      this.flipAndPush(row, 1, this.rowSize, this.fillingBytes)
      chunk = chunk.slice(needFilling)
    }

    const rows = Math.floor(chunk.length / this.rowSize)

    this.saveNotFullRow(chunk, rows, this.rowSize)
    this.flipAndPush(chunk, rows, this.rowSize, this.fillingBytes)

    next()
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

      const reversiblePart = row.slice(0, rowSize - fillingBytes)

      flipRow(reversiblePart)

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
