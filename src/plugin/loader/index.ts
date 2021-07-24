import { interpolateName, parseQuery } from 'loader-utils'
import { LoaderContext } from 'webpack'
import { extname } from 'path'

import { createProcessedBuffers } from './sharp'

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

async function loader(this: LoaderContext<LoaderOptions>, content: Buffer) {
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

  const fallbackSources: { filename: string; size: number }[] = []
  const webpSources: { filename: string; size: number }[] = []

  const { buffers, metaData } = await createProcessedBuffers(
    resourcePath,
    mime,
    loaderOptions
  )
  buffers.forEach(({ data, info }) => {
    const fallbackOutputFilename = replaceExtensionPlaceholder(
      fallbackFileName,
      info.width,
      info.height
    )
    const webpOutputFilename = replaceExtensionPlaceholder(
      webpFileName,
      info.width,
      info.height
    )

    switch (info.format) {
      case 'jpeg':
        createFile(data, fallbackOutputFilename)
        fallbackSources.push({
          filename: fallbackOutputFilename,
          size: info.width,
        })
        break
      case 'png':
        createFile(data, fallbackOutputFilename)
        fallbackSources.push({
          filename: fallbackOutputFilename,
          size: info.width,
        })
        break
      case 'webp':
        createFile(data, webpOutputFilename)
        webpSources.push({
          filename: webpOutputFilename,
          size: info.width,
        })
        break
    }
  })

  const createSrcSet = (sources: { filename: string; size: number }[]) =>
    sources
      .map(
        ({ filename, size }) =>
          `${loaderOptions.publicPath + filename} ${size}w`
      )
      .join(',')

  loaderCallback(
    null,
    `module.exports = {
      src: '${loaderOptions.publicPath}',
      fallbackSrcSet: '${createSrcSet(fallbackSources)}',
      webpSrcSet: '${createSrcSet(webpSources)}',
      width: ${metaData.width},
      height: ${metaData.height},
    }`
  )
}

module.exports = loader
