import getConfig from 'next/config'
import React from 'react'

import type { BuildImageConfig } from '../plugin/plugin'

type Props = {
  src: string
  webp?: boolean
  alt?: string
}

const { publicRuntimeConfig } = getConfig() as {
  publicRuntimeConfig: {
    buildImage: BuildImageConfig
  }
}

const resizeParams = publicRuntimeConfig.buildImage.imageSizes
  .map((size) => `sizes[]=${size}`)
  .join(',')

const Image: React.VFC<Props> = ({ src, webp = true, alt }) => {
  return (
    <picture>
      {webp && (
        <source
          srcSet={require(`${src}?resize&${resizeParams}&format=webp`).srcSet}
        />
      )}
      <source srcSet={require(`${src}?resize&${resizeParams}`).srcSet} />
      <img
        src={require(src).src}
        width={require(src).widht}
        height={require(src).height}
        alt={alt}
      />
    </picture>
  )
}

export default Image
