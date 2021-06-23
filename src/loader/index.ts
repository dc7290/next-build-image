import sharp from 'sharp'
import { LoaderContext } from 'webpack'

import type { Options } from './types'

export default async function sharpLoader(
  this: LoaderContext<Options>,
  content: string
) {
  const callback = this.async()
  // const loaderOptions = this.getOptions()

  const transformer = sharp(content)
  const {} = await transformer
    .rotate()
    .toFormat('webp')
    .toFile(content + '.webp')

  callback(null, content + '.webp')
}
