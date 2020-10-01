const fs = require('fs')
const path = require('path')
const MirrorStream = require('./mirrorStream')

/**
 * Read, convert and save file
 * @returns {Promise<void>}
 */
const main = async () => {
  const mirrorStream = new MirrorStream()
  const readStream = fs.createReadStream(path.join(__dirname, '../', 'assets/', 'test.txt'), { encoding: 'utf8', highWaterMark: 3 })
  const writeStream = fs.createWriteStream(path.join(__dirname, '../', 'dist/', 'test_out.txt'))
  readStream.on('open', () => {
    try {
      readStream.pipe(mirrorStream).pipe(writeStream)
    } catch (e) {
      console.log(e)
    }
  })

}

main()
