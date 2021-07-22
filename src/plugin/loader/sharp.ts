import sharp, { OutputInfo, Sharp } from 'sharp'
import { DefaultMargedLoaderOptions } from '.'

type ResizeProps = {
  data: Sharp
  width: number
}

type Mime = 'image/jpeg' | 'image/png'

export function resizeAndCreateFallbackImage({
  data,
  width,
  mime,
}: ResizeProps & { mime: Mime }) {
  switch (mime) {
    case 'image/jpeg':
      return data.resize({ width }).jpeg().toBuffer({ resolveWithObject: true })
    case 'image/png':
      return data.resize({ width }).png().toBuffer({ resolveWithObject: true })
  }
}

export function resizeAndConvertToWebp({ data, width }: ResizeProps) {
  return data.resize({ width }).webp().toBuffer({ resolveWithObject: true })
}

export async function createProcessedBuffers(
  content: Buffer,
  mime: Mime,
  options: DefaultMargedLoaderOptions
) {
  const sharpStream = sharp(content)

  const promises: Promise<{
    data: Buffer
    info: OutputInfo
  }>[] = []
  options.deviceSizes.forEach((size) => {
    promises.push(resizeAndConvertToWebp({ data: sharpStream, width: size }))
    promises.push(
      resizeAndCreateFallbackImage({ data: sharpStream, width: size, mime })
    )
  })

  return await Promise.all(promises)
}
