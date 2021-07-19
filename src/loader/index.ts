import { parseQuery } from 'loader-utils'
import { ImagePool } from '@squoosh/lib'
import { LoaderContext } from 'webpack'
import path from 'path'

export type LoaderOptions = {
  name: string
  outputPath: string
  publicPath: string
  deviceSizes: number[]
}

export const defaultOptions: LoaderOptions = {
  name: '[name]-[contenthash]-[width].[ext]',
  outputPath: 'static/chunks/images/',
  publicPath: '/_next/static/chunks/images/',
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
}

async function squooshLoader(
  this: LoaderContext<LoaderOptions>,
  content: Buffer
) {
  const loaderCallback = this.async()
  const loaderOptions = Object.assign({}, defaultOptions, this.getOptions())

  let imagePool
  let image

  try {
    imagePool = new ImagePool()
    image = imagePool.ingestImage(content)

    const imageData = (await image.decoded).bitmap

    const operations: {
      type: 'resize'
      width: number
      height?: number
    }[] = []
    loaderOptions.deviceSizes.forEach((size) => {
      if (imageData.width >= size) {
        operations.push({
          type: 'resize',
          width: size,
        })
      }
    })

    for (const operation of operations) {
      if (operation.type === 'resize') {
        await image.preprocess({
          resize: {
            enabled: true,
            width: operation.width,
          },
        })
      }
    }
  } catch (error) {
    if (imagePool) {
      await imagePool.close()
    }

    throw Error(error)
  }

  await imagePool.close()
}

export default squooshLoader
