const { MyReadStream, MyWriteStream } = require('./core')

/**
 * Read, convert and save file
 * @returns {Promise<void>}
 */

const bigArray = Array.from({ length: 30 }, (v, k) => k + 1)
const readOptions = { highWaterMark: 3 }
const readStream = new MyReadStream(bigArray, readOptions)

const writeStream = new MyWriteStream()

readStream.pipe(writeStream)

readStream.on('close', () => {
  const result = writeStream.getResult()

  console.log('Result:', result)
})
