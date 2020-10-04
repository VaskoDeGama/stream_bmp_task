const { flipRow, MyWriteStream, MyReadStream } = require('../src/core')

describe('flip row', () => {
  test('test row ', async () => {
    const testBuffer = Buffer.alloc(9, 'ffffffaaaaaabbbbbb', 'hex')
    const equalBuffer = Buffer.alloc(9, 'bbbbbbaaaaaaffffff', 'hex')
    const result = flipRow(testBuffer)

    console.log(testBuffer)
    console.log(result)
    expect(result).toStrictEqual(equalBuffer)
  })
  test('test row 2 ', async () => {
    const testBuffer = Buffer.from('ffffffaaaaaabbbbbbccccccdddddd', 'hex')
    const equalBuffer = Buffer.from('ddddddccccccbbbbbbaaaaaaffffff', 'hex')
    const result = flipRow(testBuffer)

    expect(result).toStrictEqual(equalBuffer)
  })
  test('test row 3 ', async () => {
    const testBuffer = Buffer.from('ffffffaaaaaabbbbbbccccccdddddd111111222222333333444444', 'hex')
    const equalBuffer = Buffer.from('444444333333222222111111ddddddccccccbbbbbbaaaaaaffffff', 'hex')
    const result = flipRow(testBuffer)

    expect(result).toStrictEqual(equalBuffer)
  })
})

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

// describe('TRANSFORM STREAM', () => {
//   test('error test not bmp', async () => {
//     const inputPath = path.join(__dirname, '../', 'assets/', 'BMPfileFormat.png')
//     const outputPath = path.join(__dirname, '../', 'dist/', 'BMPfileFormat.png')
//
//     try {
//       await pipeline(inputPath, outputPath)
//     } catch (e) {
//       expect(e.message).toEqual('InvalidImageError')
//     }
//   })
//   test('convert small square file', async () => {
//     const inputPath = path.join(__dirname, '../', 'assets/', 'input.bmp')
//     const samplePath = path.join(__dirname, '../', 'dist/', '__tests___assets_output.bmp')
//     const outputPath = path.join(__dirname, '../', 'dist/', 'output.bmp')
//
//     const res = await pipeline(inputPath, outputPath)
//
//     console.log(res)
//
//     const sample = await fs.readFile(samplePath)
//     const result = await fs.readFile(outputPath)
//
//     expect(Buffer.compare(result, sample)).toStrictEqual(0)
//   })
//
//   test('convert small with latency and very small package', async () => {
//     const inputPath = path.join(__dirname, '../', 'assets/', 'input.bmp')
//     const samplePath = path.join(__dirname, '../', 'dist/', '__tests___assets_output.bmp')
//     const outputPath = path.join(__dirname, '../', 'dist/', 'output.bmp')
//
//     const buffer = await fs.readFile(inputPath)
//     let idx = 0
//     let offsetIdx = 0
//     const shift = [2, 3, 4, 5, 6, 7]
//
//     const flip = new MirrorStream()
//     const ws = syncFs.createWriteStream(outputPath)
//
//     class TestReadable extends Readable {
//       _read (size) {
//         if (idx < buffer.length) {
//           setTimeout(() => {
//             let end = shift[(offsetIdx++) % shift.length]
//
//             if (end + idx >= buffer.length) {
//               end = buffer.length
//             }
//
//             this.push(buffer.slice(idx, idx + end))
//             idx += end
//           }, 2)
//         } else {
//           this.push(null)
//         }
//       }
//     }
//
//     const t = new TestReadable()
//
//     try {
//       await asyncPipeline(
//         t,
//         flip,
//         ws
//       )
//     } catch (e) {
//       console.log(e)
//     }
//
//     // const res = await pipeline(inputPath, outputPath)
//
//     // console.log(res)
//
//     const sample = await fs.readFile(samplePath)
//     const result = await fs.readFile(outputPath)
//
//     expect(Buffer.compare(result, sample)).toStrictEqual(0)
//   })
//
//   test('not div on 4', async () => {
//     const inputPath = path.join(__dirname, '../', 'assets/', 'notdiv4.bmp')
//     const samplePath = path.join(__dirname, '../', 'dist/', '__test___notdiv4_output.bmp')
//     const outputPath = path.join(__dirname, '../', 'dist/', 'notdiv4_output.bmp')
//     const res = await pipeline(inputPath, outputPath)
//
//     console.log(res)
//
//     const sample = await fs.readFile(samplePath)
//     const result = await fs.readFile(outputPath)
//
//     expect(Buffer.compare(result, sample)).toStrictEqual(0)
//   })
//   test('convert height  file', async () => {
//     const inputPath = path.join(__dirname, '../', 'assets/', 'heidth.bmp')
//     const samplePath = path.join(__dirname, '../', 'dist/', '__tests___heidth_output.bmp')
//     const outputPath = path.join(__dirname, '../', 'dist/', 'heidth.bmp')
//     const res = await pipeline(inputPath, outputPath)
//
//     console.log(res)
//
//     const sample = await fs.readFile(samplePath)
//     const result = await fs.readFile(outputPath)
//
//     expect(Buffer.compare(result, sample)).toStrictEqual(0)
//   })
//   test('convert 30mb ', async () => {
//     const inputPath = path.join(__dirname, '../', 'assets/', 'kekasic.bmp')
//     const samplePath = path.join(__dirname, '../', 'dist/', '__test__kekasic_output.bmp')
//     const outputPath = path.join(__dirname, '../', 'dist/', 'kekasic_output.bmp')
//     const res = await pipeline(inputPath, outputPath)
//
//     console.log(res)
//
//     const sample = await fs.readFile(samplePath)
//     const result = await fs.readFile(outputPath)
//
//     expect(Buffer.compare(result, sample)).toStrictEqual(0)
//   })
//   test('convert 80mb', async () => {
//     const inputPath = path.join(__dirname, '../', 'assets/', 'big.bmp')
//     const samplePath = path.join(__dirname, '../', 'dist/', '__tests___big_output.bmp')
//     const outputPath = path.join(__dirname, '../', 'dist/', 'big_output.bmp')
//     const res = await pipeline(inputPath, outputPath)
//
//     console.log(res)
//
//     const sample = await fs.readFile(samplePath)
//     const result = await fs.readFile(outputPath)
//
//     expect(Buffer.compare(result, sample)).toStrictEqual(0)
//   })
//   test('convert 300mb', async () => {
//     const inputPath = path.join(__dirname, '../', 'assets/', 'big2.bmp')
//     const samplePath = path.join(__dirname, '../', 'dist/', '__tests___big2_output.bmp')
//     const outputPath = path.join(__dirname, '../', 'dist/', 'big2_output.bmp')
//     const res = await pipeline(inputPath, outputPath)
//
//     console.log(res)
//
//     const sample = await fs.readFile(samplePath)
//     const result = await fs.readFile(outputPath)
//
//     expect(Buffer.compare(result, sample)).toStrictEqual(0)
//   })
// })
