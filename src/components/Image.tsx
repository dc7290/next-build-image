import React from 'react'

const VALID_LAYOUT_VALUES = [
  'fill',
  'fixed',
  'intrinsic',
  'responsive',
] as const
type LayoutValue = typeof VALID_LAYOUT_VALUES[number]

const VALID_LOADING_VALUES = ['lazy', 'eager'] as const
type LoadingValue = typeof VALID_LOADING_VALUES[number]

type PlaceholderValue = 'blur' | 'empty'

type ImgElementStyle = NonNullable<JSX.IntrinsicElements['img']['style']>

type ImageProps = Omit<
  JSX.IntrinsicElements['img'],
  'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading' | 'style'
> & {
  src: string
  width?: number
  height?: number
  layout?: LayoutValue
  quality?: number | string
  priority?: boolean
  loading?: LoadingValue
  lazyBoundary?: string
  placeholder?: PlaceholderValue
  blurDataURL?: string
  unoptimized?: boolean
  objectFit?: ImgElementStyle['objectFit']
  objectPosition?: ImgElementStyle['objectPosition']
  onLoadingComplete?: () => void
}

const Image: React.VFC<ImageProps> = () => {
  return (
    <div>
      <picture>
        <img />
      </picture>
    </div>
  )
}

export default Image
