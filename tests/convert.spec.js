const fs = require('fs').promises
const path = require('path')
const { convert } = require('../src/core')

jest.setTimeout(900000)

describe('convert', () => {
  test('error test not bmp', async () => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'BMPfileFormat.png')
    const inputBuff = await fs.readFile(inputPath)

    expect.assertions(1)

    try {
      await convert(inputBuff)
    } catch (e) {
      expect(e.message).toEqual('InvalidImageError')
    }
  })
  test('convert small square file', async () => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'input.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__tests___assets_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'output.bmp')
    const inputBuff = await fs.readFile(inputPath)
    const sample = await fs.readFile(samplePath)

    const result = await convert(inputBuff)

    await fs.writeFile(outputPath, result)
    expect(Buffer.compare(result, sample)).toStrictEqual(0)
  })
  test('not div on 4', async () => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'notdiv4.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__test___notdiv4_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'notdiv4_output.bmp')
    const inputBuff = await fs.readFile(inputPath)
    const sample = await fs.readFile(samplePath)

    const result = await convert(inputBuff)

    await fs.writeFile(outputPath, result)
    expect(Buffer.compare(result, sample)).toStrictEqual(0)
  })
  test('convert height  file', async () => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'heidth.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__tests___heidth_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'heidth.bmp')
    const inputBuff = await fs.readFile(inputPath)
    const sample = await fs.readFile(samplePath)

    const result = await convert(inputBuff)

    await fs.writeFile(outputPath, result)
    expect(Buffer.compare(result, sample)).toStrictEqual(0)
  })
  test('convert 30mb ', async () => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'kekasic.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__test__kekasic_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'kekasic_output.bmp')
    const inputBuff = await fs.readFile(inputPath)
    const sample = await fs.readFile(samplePath)

    const result = await convert(inputBuff)

    await fs.writeFile(outputPath, result)
    expect(Buffer.compare(result, sample)).toStrictEqual(0)
  })
  test('convert 80mb', async () => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'big.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__tests___big_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'big_output.bmp')
    const inputBuff = await fs.readFile(inputPath)
    const sample = await fs.readFile(samplePath)

    const result = await convert(inputBuff)

    await fs.writeFile(outputPath, result)
    expect(Buffer.compare(result, sample)).toStrictEqual(0)
  })
  test('convert 300mb', async () => {
    const inputPath = path.join(__dirname, '../', 'assets/', 'big2.bmp')
    const samplePath = path.join(__dirname, '../', 'dist/', '__tests___big2_output.bmp')
    const outputPath = path.join(__dirname, '../', 'dist/', 'big2_output.bmp')
    const inputBuff = await fs.readFile(inputPath)
    const sample = await fs.readFile(samplePath)

    const result = await convert(inputBuff)

    await fs.writeFile(outputPath, result)
    expect(Buffer.compare(result, sample)).toStrictEqual(0)
  })
})
