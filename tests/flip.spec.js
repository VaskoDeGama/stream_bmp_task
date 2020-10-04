const { flipRow } = require('../src/core')

describe('flip row', () => {
  test('test row ', async () => {
    const testBuffer = Buffer.alloc(9, 'ffffffaaaaaabbbbbb', 'hex')
    const equalBuffer = Buffer.alloc(9, 'bbbbbbaaaaaaffffff', 'hex')
    const result = flipRow(testBuffer)

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
