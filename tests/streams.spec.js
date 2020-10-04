const { MyWriteStream, MyReadStream } = require('../src/core')

jest.setTimeout(90000)

describe('STREAMS:', () => {
  test('pipe', async () => {
    const bigArray = Array.from({ length: 30 }, (v, k) => k + 1)
    const readOptions = { highWaterMark: 3 }
    const readStream = new MyReadStream(bigArray, readOptions)

    const writeStream = new MyWriteStream()

    readStream.pipe(writeStream)

    const result = new Promise(resolve => {
      readStream.on('close', () => {
        const res = writeStream.getResult()

        writeStream.destroy()
        readStream.destroy()
        resolve(res)
      })
    })

    const arr = await result

    expect(arr.length).toBe(3)
  })
  test('events', async () => {
    const bigArray = Array.from({ length: 30 }, (v, k) => k + 1)
    const readOptions = { highWaterMark: 3 }
    const readStream = new MyReadStream(bigArray, readOptions)

    const writeStream = new MyWriteStream()

    readStream.on('data', (chunk) => {
      writeStream.write(chunk)
    })

    readStream.on('end', () => {
      writeStream.end()
    })

    const result = new Promise(resolve => {
      readStream.on('close', () => {
        const res = writeStream.getResult()

        writeStream.destroy()
        readStream.destroy()
        resolve(res)
      })
    })

    const arr = await result

    expect(arr.length).toBe(3)
  })
  test('drain', async () => {
    const bigArray = Array.from({ length: 30 }, (v, k) => k + 1)
    const readOptions = { highWaterMark: 3 }
    const writeOptions = { highWaterMark: 2 }
    const readStream = new MyReadStream(bigArray, readOptions)

    const writeStream = new MyWriteStream(writeOptions)

    const writeDataOrNot = (data, cb) => {
      if (!writeStream.write(data)) {
        readStream.pause()
        writeStream.once('drain', cb)
      } else {
        process.nextTick(cb)
      }
    }

    const onDrain = () => {
      readStream.resume()
    }

    readStream.on('data', (chunk) => {
      writeDataOrNot(chunk, onDrain)
    })

    readStream.on('end', () => {
      writeStream.end()
    })

    const result = new Promise(resolve => {
      readStream.on('close', () => {
        const res = writeStream.getResult()

        writeStream.destroy()
        readStream.destroy()
        resolve(res)
      })
    })

    const arr = await result

    expect(arr.length).toBe(3)
  })
})
