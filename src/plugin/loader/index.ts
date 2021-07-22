import { interpolateName, parseQuery } from 'loader-utils'
import { LoaderContext } from 'webpack'
import { extname } from 'path'

import {
  createProcessedBuffers,
  resizeAndConvertToWebp,
  resizeAndCreateFallbackImage,
} from './sharp'

type LoaderOptions = {
  name?: string
  outputPath?: string
  publicPath?: string
  deviceSizes?: number[]
}

const defaultOptions = {
  name: '[name]-[contenthash]-[width].[ext]',
  outputPath: 'static/chunks/images/',
  publicPath: '/_next/static/chunks/images/',
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
}

export type DefaultMargedLoaderOptions = LoaderOptions & typeof defaultOptions

const mimeMap: {
  [key: string]: 'image/png' | 'image/jpeg'
} = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
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
  const mime = mimeMap[ext]

  if (!mime) {
    loaderCallback(
      Error(
        `The "${resourcePath}" could not be optimized. ${ext} extension is not supported.`
      )
    )
    return
  }

  const fallbackFileName = interpolateName(this, loaderOptions.name, {
    content,
    context,
    regExp: '',
  })
  const webpFileName = interpolateName(
    this,
    loaderOptions.name.replace(/\[ext\]/, 'webp'),
    {
      content,
      context,
      regExp: '',
    }
  )

  const replaceExtensionPlaceholder = (
    name: string,
    width: number,
    height: number
  ) => {
    return name
      .replace(/\[width\]/, width.toString())
      .replace(/\[height\]/, height.toString())
  }

  const createFile = (content: Buffer, filename: string) => {
    this.emitFile(loaderOptions.outputPath + filename, content)
  }

  const fallbackSources = []
  const webpSources = []

  const processedBuffers = await createProcessedBuffers(
    content,
    mime,
    loaderOptions
  )
  processedBuffers.forEach(({ data, info }) => {
    switch (info.format) {
      case 'jpeg':
        createFile(
          data,
          replaceExtensionPlaceholder(fallbackFileName, info.width, info.height)
        )
        break
      case 'png':
        createFile(
          data,
          replaceExtensionPlaceholder(fallbackFileName, info.width, info.height)
        )
        break
      case 'webp':
        createFile(
          data,
          replaceExtensionPlaceholder(webpFileName, info.width, info.height)
        )
        break
    }
  })

  loaderCallback(
    null,
    `module.exports = {
      src: '${loaderOptions.publicPath + fileName}'
    }`
  )
}

module.exports = squooshLoader
