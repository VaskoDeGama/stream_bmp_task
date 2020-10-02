const fs = require('fs')
const stream = require('stream')
const util = require('util')
const asyncPipeline = util.promisify(stream.pipeline)
const MirrorStream = require('./mirrorStream')

const transform = async (inputPath, transform, outputPath) => {
  try {
    await asyncPipeline(
      fs.createReadStream(inputPath),
      transform,
      fs.createWriteStream(outputPath)
    )
    return 'Transform succeeded.'
  } catch (e) {
    return e
  }
}

const pipeline = async (inputPath, outputPath) => {
  try {
    if (!fs.existsSync(inputPath)) {
      return new Error('File not exist')
    }

    if (!fs.existsSync(outputPath)) {
      fs.writeFileSync(outputPath, '')
    }

    const flip = new MirrorStream()

    return await transform(inputPath, flip, outputPath)
  } catch (e) {
    return e
  }
}

module.exports = pipeline
