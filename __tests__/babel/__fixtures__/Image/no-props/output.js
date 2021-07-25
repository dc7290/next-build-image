import React from 'react'
import { Image } from 'next-build-image'
export default () => (
  <div>
    <Image src={require('./image.png')} />
  </div>
)
