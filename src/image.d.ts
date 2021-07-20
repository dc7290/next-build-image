interface StaticImageData {
  src: string
  width: number
  height: number
  placeholder?: string
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
