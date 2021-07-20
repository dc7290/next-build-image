import { interpolateName, parseQuery } from 'loader-utils'
import { ImagePool } from '@squoosh/lib'
import { LoaderContext } from 'webpack'
import { extname } from 'path'

export type LoaderOptions = {
  name: string
  outputPath: string
  publicPath: string
  deviceSizes: number[]
}

export const defaultOptions: LoaderOptions = {
  name: '[name]-[contenthash]',
  outputPath: 'static/chunks/images/',
  publicPath: '/_next/static/chunks/images/',
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
}

const targets: {
  [key: string]: string
} = {
  '.png': 'oxipng',
  '.jpg': 'mozjpeg',
  '.jpeg': 'mozjpeg',
  '.webp': 'webp',
}

async function squooshLoader(
  this: LoaderContext<LoaderOptions>,
  content: Buffer
) {
  const loaderCallback = this.async()
  const loaderOptions = Object.assign({}, defaultOptions, this.getOptions())

  const context = this.context ?? this.rootContext
  const resourcePath = this.resourcePath
  const ext = extname(resourcePath)
  const targetCodec = targets[ext]

  if (!targetCodec) {
    loaderCallback(
      Error(
        `The "${this.resourcePath}" could not be optimized. ${ext} extension is not supported.`
      )
    )
    return
  }

  const encodeOptions = {
    [targetCodec]: {},
  }

  let imagePool
  let image

  try {
    imagePool = new ImagePool()
    image = imagePool.ingestImage(resourcePath)

    const imageData = await image.decoded

    const operations: {
      type: 'resize'
      width: number
      height?: number
    }[] = []
    loaderOptions.deviceSizes.forEach((size) => {
      if (imageData.bitmap.width >= size) {
        operations.push({
          type: 'resize',
          width: size,
        })
      }
    })

    // for (const operation of operations) {
    //   if (operation.type === 'resize') {
    //     await image.preprocess({
    //       resize: {
    //         enabled: true,
    //         width: operation.width,
    //       },
    //     })
    //   }
    // }

    await image.encode(encodeOptions)
  } catch (error) {
    if (imagePool) {
      await imagePool.close()
    }

    loaderCallback(Error(error))
    return
  }

  await imagePool.close()

  const fileName =
    interpolateName(this, loaderOptions.name, {
      content,
      context,
      regExp: '',
    }) +
    '.' +
    (await image.encodedWith.oxipng).extension

  this.emitFile(
    loaderOptions.outputPath + fileName,
    Buffer.from((await image.encodedWith.oxipng).binary)
  )

  loaderCallback(
    null,
    `module.exports = {
      src: '${loaderOptions.publicPath + fileName}'
    }`
  )
}

module.exports = squooshLoader
