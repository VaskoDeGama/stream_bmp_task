const fs = require('fs')
const stream = require('stream')
const util = require('util')
const asyncPipeline = util.promisify(stream.pipeline)
const MirrorStream = require('./mirrorStream')

/**
 * Call promisifyed pipeline
 * @async
 * @param {string} inputPath - path to input file
 * @param {MirrorStream} transform - transform stream
 * @param {string} outputPath - path to output file
 * @returns {Promise<string|>}
 */
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

/**
 * Wrapper for pipeline transform
 * @async
 * @param {string} inputPath - input File path
 * @param {string} outputPath - output File path
 * @returns {Promise<string|Error|*>}
 */
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
