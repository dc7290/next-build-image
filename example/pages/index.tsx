import { NextPage } from 'next'

import Image from './image.png'

const IndexPage: NextPage = () => {
  return (
    <div>
      <picture>
        <source srcSet={Image.webpSrcSet} type="image/webp" />
        <img
          srcSet={Image.fallbackSrcSet}
          width={Image.width}
          height={Image.height}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </picture>
    </div>
  )
}

export default IndexPage
