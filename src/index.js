const fs = require('fs')
const path = require('path')
const stream = require('stream')
const { MirrorStream } = require('./core')
/**
 * Read, convert and save file
 * @returns {Promise<void>}
 */

const [inputArg, outputArg] = process.argv.splice(2, 2)
const inputPath = path.join(__dirname, '../', inputArg)
const outputPath = path.join(__dirname, '../', outputArg)

const main = async () => {
  try {
    if (!fs.existsSync(inputPath)) {
      return new Error('File not exist')
    }

    if (!fs.existsSync(outputPath)) {
      fs.writeFileSync(outputPath, '')
    }

    const flip = new MirrorStream()
    const rs = fs.createReadStream(inputPath)
    const ws = fs.createWriteStream(outputPath)

    stream.pipeline(
      rs,
      flip,
      ws,
      (err) => {
        if (err) {
          throw err
        } else {
          console.log('Transform succeeded')
        }
      }
    )
  } catch (e) {
    console.log(e)
    return e
  }
}

main()
