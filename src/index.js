const { MyReadStream, MyWriteStream } = require('./core')

/**
 * Read, convert and save file
 * @returns {Promise<void>}
 */

const bigArray = Array.from({ length: 30 }, (v, k) => k + 1)
const readOptions = { highWaterMark: 3 }
const readStream = new MyReadStream(bigArray, readOptions)

const writeStream = new MyWriteStream()

readStream.on('data', (chunk) => {
  writeStream.write(chunk)
})

readStream.on('end', () => {
  writeStream.write('___END___')
  console.log('End data')

  const result = writeStream.getResult()

  console.log(result)
})
