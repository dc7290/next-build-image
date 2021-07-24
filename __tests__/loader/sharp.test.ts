import { readFileSync } from 'fs'
import { resolve } from 'path'
import sharp from 'sharp'

import {
  createProcessedBuffers,
  resizeAndConvertToWebp,
  resizeAndCreateFallbackImage,
} from '../../src/loader/sharp'

const jpegImgage = readFileSync(resolve(__dirname, './image.jpeg'))
const pngImage = readFileSync(resolve(__dirname, './image.png'))

test('フォールバック画像が適切にリサイズされるか: jpeg', async () => {
  const width = 500
  const { info } = await resizeAndCreateFallbackImage({
    data: sharp(jpegImgage),
    width,
    mime: 'image/jpeg',
  })
  expect(info).toMatchObject({
    width,
    format: 'jpeg',
  })
})

test('フォールバック画像が適切にリサイズされるか: png', async () => {
  const width = 500
  const { info } = await resizeAndCreateFallbackImage({
    data: sharp(pngImage),
    width,
    mime: 'image/png',
  })
  expect(info).toMatchObject({
    width,
    format: 'png',
  })
})

test('webpに変換かつ、適切にリサイズされるか: jpeg', async () => {
  const width = 500
  const { info } = await resizeAndConvertToWebp({
    data: sharp(jpegImgage),
    width,
  })
  expect(info).toMatchObject({
    width,
    format: 'webp',
  })
})

test('webpに変換かつ、適切にリサイズされるか: png', async () => {
  const width = 500
  const { info } = await resizeAndConvertToWebp({
    data: sharp(pngImage),
    width,
  })
  expect(info).toMatchObject({
    width,
    format: 'webp',
  })
})

test('複数の画像が適切に処理されるか: jpeg', async () => {
  const options = {
    name: '[name]-[contenthash]-[width].[ext]',
    outputPath: 'static/chunks/images/',
    publicPath: '/_next/static/chunks/images/',
    deviceSizes: [640, 750, 828],
  }

  const { buffers } = await createProcessedBuffers(
    jpegImgage,
    'image/jpeg',
    options
  )

  buffers.forEach(({ info }) => {
    expect(options.deviceSizes.includes(info.width)).toBeTruthy()
    expect(info).toMatchObject({
      format: expect.stringMatching(/webp|jpeg/),
    })
  })
})

test('複数の画像が適切に処理されるか: png', async () => {
  const options = {
    name: '[name]-[contenthash]-[width].[ext]',
    outputPath: 'static/chunks/images/',
    publicPath: '/_next/static/chunks/images/',
    deviceSizes: [640, 750, 828],
  }

  const { buffers, metaData } = await createProcessedBuffers(
    pngImage,
    'image/png',
    options
  )

  buffers.forEach(({ info }) => {
    expect(options.deviceSizes.includes(info.width)).toBeTruthy()
    expect(info).toMatchObject({
      format: expect.stringMatching(/webp|png/),
    })
  })
})
