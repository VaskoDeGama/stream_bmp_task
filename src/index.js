const { MirrorStream } = require('./core')
const fs = require('fs')
const path = require('path')
const stream = require('stream')
const util = require('util')
const asyncPipeline = util.promisify(stream.pipeline)

/**
 * Read, convert and save file
 * @returns {Promise<void>}
 */

const [inputArg, outputArg] = process.argv.splice(2, 2)
const inputPath = path.join(__dirname, '../', inputArg)
const outputPath = path.join(__dirname, '../', outputArg)

const transform = async (inputPath, transform, outputPath, highWaterMark = 1024) => {
  await asyncPipeline(
    fs.createReadStream(inputPath, { highWaterMark: highWaterMark }),
    transform,
    fs.createWriteStream(outputPath, { highWaterMark: highWaterMark })
  )

  return 'Transform succeeded.'
}

const main = async () => {
  try {
    if (!fs.existsSync(inputPath)) {
      return new Error('File not exist')
    }

    if (!fs.existsSync(outputPath)) {
      fs.writeFileSync(outputPath, '')
    }

    const flip = new MirrorStream()

    const result = await transform(inputPath, flip, outputPath, 1024)

    console.log(result)
  } catch (e) {
    console.log(e)
  }
}

main()
