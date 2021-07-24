interface StaticImageData {
  src: string
  fallbackSrcSet: string
  webpSrcSet: string
  width: number
  height: number
}

declare module '*.png' {
  const content: StaticImageData

  export default content
}

declare module '*.jpg' {
  const content: StaticImageData

  export default content
}

declare module '*.jpeg' {
  const content: StaticImageData

  export default content
}
