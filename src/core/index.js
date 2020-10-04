const { convert,
  decode,
  flipRow,
  decodeFileHeader,
  decodeDIBHeader,
  getRowInfo,
  verticallyReflect
} = require('./convert')

const MyWriteStream = require('./myWriteStream')
const MyReadStream = require('./myReadStream')
const MirrorStream = require('./mirrorStream')

module.exports = {
  convert,
  decode,
  flipRow,
  decodeFileHeader,
  decodeDIBHeader,
  getRowInfo,
  verticallyReflect,
  MirrorStream,
  MyWriteStream,
  MyReadStream
}
