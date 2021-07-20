import { NextPage } from 'next'

import Image from './image.png'

const IndexPage: NextPage = () => {
  return (
    <div>
      <img src={Image.src} alt="" />
    </div>
  )
}

export default IndexPage
