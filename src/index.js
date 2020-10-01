const { MirrorStream, MyReadStream, MyWriteStream } = require('./core')

/**
 * Read, convert and save file
 * @returns {Promise<void>}
 */

const readStream = new MyReadStream({}, 1)
const writeStream = new MyWriteStream()
const mirrorStream = new MirrorStream()

readStream.pipe(mirrorStream).pipe(writeStream)
readStream.on('end', () => {
  console.log(readStream.getMemory())
  console.log(writeStream.getMemory())
})
