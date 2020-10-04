const path = require('path')
const fs = require('fs')
const { MirrorStream } = require('../src/core')
const { pipeline, Readable } = require('stream')

jest.setTimeout(900000)

describe('TRANSFORM STREAM', () => {
  test('error test not bmp', done => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'BMPfileFormat.png')
    const outputPath = path.join(__dirname, '../', 'dist/', 'BMPfileFormat.png')

    const flip = new MirrorStream({})
    const rs = fs.createReadStream(inputPath)
    const ws = fs.createWriteStream(outputPath)

    flip.on('error', (err) => {
      expect(err.message).toBe('InvalidImageError')
      done()
    })

    rs.pipe(flip).pipe(ws)
  })
  test('convert small square file', done => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'input.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__tests___assets_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'output.bmp')

    const flip = new MirrorStream({})
    const rs = fs.createReadStream(inputPath)
    const ws = fs.createWriteStream(outputPath)

    pipeline(rs, flip, ws, (err) => {
      if (err) {
        done(err)
      } else {
        const sample = fs.readFileSync(samplePath)
        const result = fs.readFileSync(outputPath)

        expect(Buffer.compare(result, sample)).toStrictEqual(0)
        done()
      }
    })
  })

  test('convert small with latency and very small package', done => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'input.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__tests___assets_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'output.bmp')

    const buffer = fs.readFileSync(inputPath)
    let idx = 0
    let offsetIdx = 0
    const shift = [2, 3, 4, 5, 6, 7]

    const flip = new MirrorStream({})
    const ws = fs.createWriteStream(outputPath)

    class TestReadable extends Readable {
      _read (size) {
        if (idx < buffer.length) {
          setTimeout(() => {
            let end = shift[(offsetIdx++) % shift.length]

            if (end + idx >= buffer.length) {
              end = buffer.length
            }

            this.push(buffer.slice(idx, idx + end))
            idx += end
          }, 2)
        } else {
          this.push(null)
        }
      }
    }

    const t = new TestReadable()

    pipeline(t, flip, ws, (err) => {
      if (err) {
        done(err)
      } else {
        const sample = fs.readFileSync(samplePath)
        const result = fs.readFileSync(outputPath)

        expect(Buffer.compare(result, sample)).toStrictEqual(0)
        done()
      }
    })
  })

  test('not div on 4', done => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'notdiv4.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__test___notdiv4_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'notdiv4_output.bmp')

    const flip = new MirrorStream({})
    const rs = fs.createReadStream(inputPath)
    const ws = fs.createWriteStream(outputPath)

    pipeline(rs, flip, ws, (err) => {
      if (err) {
        done(err)
      } else {
        const sample = fs.readFileSync(samplePath)
        const result = fs.readFileSync(outputPath)

        expect(Buffer.compare(result, sample)).toStrictEqual(0)
        done()
      }
    })
  })
  test('convert height  file', done => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'heidth.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__tests___heidth_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'heidth.bmp')

    const flip = new MirrorStream({})
    const rs = fs.createReadStream(inputPath)
    const ws = fs.createWriteStream(outputPath)

    pipeline(rs, flip, ws, (err) => {
      if (err) {
        done(err)
      } else {
        const sample = fs.readFileSync(samplePath)
        const result = fs.readFileSync(outputPath)

        expect(Buffer.compare(result, sample)).toStrictEqual(0)
        done()
      }
    })
  })
  test('convert 30mb ', done => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'kekasic.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__test__kekasic_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'kekasic_output.bmp')

    const flip = new MirrorStream({})
    const rs = fs.createReadStream(inputPath)
    const ws = fs.createWriteStream(outputPath)

    pipeline(rs, flip, ws, (err) => {
      if (err) {
        done(err)
      } else {
        const sample = fs.readFileSync(samplePath)
        const result = fs.readFileSync(outputPath)

        expect(Buffer.compare(result, sample)).toStrictEqual(0)
        done()
      }
    })
  })
  test('convert 80mb', done => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'big.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__tests___big_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'big_output.bmp')

    const flip = new MirrorStream({})
    const rs = fs.createReadStream(inputPath)
    const ws = fs.createWriteStream(outputPath)

    pipeline(rs, flip, ws, (err) => {
      if (err) {
        done(err)
      } else {
        const sample = fs.readFileSync(samplePath)
        const result = fs.readFileSync(outputPath)

        expect(Buffer.compare(result, sample)).toStrictEqual(0)
        done()
      }
    })
  })
  test('convert 300mb', done => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'big2.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__tests___big2_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'big2_output.bmp')

    const flip = new MirrorStream({})
    const rs = fs.createReadStream(inputPath)
    const ws = fs.createWriteStream(outputPath)

    pipeline(rs, flip, ws, (err) => {
      if (err) {
        done(err)
      } else {
        const sample = fs.readFileSync(samplePath)
        const result = fs.readFileSync(outputPath)

        expect(Buffer.compare(result, sample)).toStrictEqual(0)
        done()
      }
    })
  })
})
