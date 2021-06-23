import React from 'react'

type Props = {
  src: string
  alt?: string
}

const Image: React.VFC<Props> = ({ src, alt }) => {
  return <img src={require(src)} alt={alt} />
}

export default Image
