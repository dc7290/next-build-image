type EncodeOptions = {
  mozjpeg?: {
    quality?: number
    baseline?: boolean
    arithmetic?: boolean
    progressive?: boolean
    optimize_coding?: boolean
    smoothing?: number
    color_space?: number
    quant_table?: number
    trellis_multipass?: boolean
    trellis_opt_zero?: boolean
    trellis_opt_table?: boolean
    trellis_loops?: number
    auto_subsample?: boolean
    chroma_subsample?: number
    separate_chroma_quality?: boolean
    chroma_quality?: number
  }
  webp?: {
    quality?: number
    target_size?: number
    target_PSNR?: number
    method?: number
    sns_strength?: number
    filter_strength?: number
    filter_sharpness?: number
    filter_type?: number
    partitions?: number
    segments?: number
    pass?: number
    show_compressed?: number
    preprocessing?: number
    autofilter?: number
    partition_limit?: number
    alpha_compression?: number
    alpha_filtering?: number
    alpha_quality?: number
    lossless?: number
    exact?: number
    image_hint?: number
    emulate_jpeg_size?: number
    thread_level?: number
    low_memory?: number
    near_lossless?: number
    use_delta_palette?: number
    use_sharp_yuv?: number
  }
  avif?: {
    cqLevel?: number
    cqAlphaLevel?: number
    denoiseLevel?: number
    tileColsLog2?: number
    tileRowsLog2?: number
    speed?: number
    subsample?: number
    chromaDeltaQ?: boolean
    sharpness?: number
    tune?: number
  }
  jxl?: {
    speed?: number
    quality?: number
    progressive?: boolean
    epf?: number
    nearLossless?: number
    lossyPalette?: boolean
    decodingSpeedTier?: number
  }
  wp2?: {
    quality?: number
    alpha_quality?: number
    effort?: number
    pass?: number
    sns?: number
    uv_mode?: number
    csp_type?: number
    error_diffusion?: number
    use_random_matrix?: boolean
  }
  oxipng?: {
    level?: number
  }
}

declare module '@squoosh/lib' {
  class Image {
    constructor(workerPool, file)
    preprocess(preprocessOptions: object): Promise<void>
    decoded: Promise<{
      bitmap: {
        data: ArrayBuffer
        width: number
        height: number
      }
      size: number
    }>
    encode(encodeOptions: EncodeOptions): Promise<void>
    encodedWith: {
      [key: string]: Promise<any>
    }
  }
  class ImagePool {
    constructor(threads?: number)
    ingestImage(image: string | URL): Image
    close(): Promise<void>
  }
}
