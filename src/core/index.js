const convert = require('./convert')
const MyWriteStream = require('./myWriteStream')
const MyReadStream = require('./myReadStream')
const MirrorStream = require('./mirrorStream')
const pipeline = require('./pipline')

module.exports = {
  convert,
  MirrorStream,
  MyWriteStream,
  MyReadStream,
  pipeline
}
