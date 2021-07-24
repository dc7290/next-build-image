import { NextConfig } from 'next/dist/next-server/server/config-shared'
import { Configuration } from 'webpack'

export type ImageConfig = {
  name: string
  outputPath: string
  publicPath: string
  deviceSizes: number[]
}

export const defaultOptions: ImageConfig = {
  name: '[name]-[contenthash]-[width].[ext]',
  outputPath: 'static/chunks/images/',
  publicPath: '/_next/static/chunks/images/',
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
}

function withBuildImage(nextConfig: NextConfig): NextConfig {
  const enrichedConfig = Object.assign<ImageConfig, ImageConfig>(
    defaultOptions,
    nextConfig.squooshImages
  )

  return Object.assign({}, nextConfig, {
    images: {
      disableStaticImages: true,
    },
    webpack: (config: Configuration, options: Record<string, unknown>) => {
      config.module?.rules?.push({
        test: /\.(jpe?g|png|)$/,
        use: [
          {
            loader: require.resolve('./loader/index'),
            options: enrichedConfig,
          },
        ],
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  })
}

export default withBuildImage
