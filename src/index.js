const path = require('path')
const { pipeline } = require('./core')
/**
 * Read, convert and save file
 * @returns {Promise<void>}
 */

const [inputArg, outputArg] = process.argv.splice(2, 2)
const inputPath = path.join(__dirname, '../', inputArg)
const outputPath = path.join(__dirname, '../', outputArg)

const main = async () => {
  try {
    const result = await pipeline(inputPath, outputPath)

    console.log(result)
  } catch (e) {
    console.log(e)
    return e
  }
}

main()
