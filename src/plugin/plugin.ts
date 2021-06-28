import { NextConfig } from 'next/dist/next-server/server/config-shared'
import { Configuration } from 'webpack'

export type BuildImageConfig = {
  name: string
  outputPath: string
  publicPath: string
  deviceSizes: number[]
  imageSizes: number[]
  cacheDirectory: string
}

export const defaultOptions: BuildImageConfig = {
  name: '[name]-[contenthash]-[width].[ext]',
  outputPath: 'static/chunks/images/',
  publicPath: '/_next/static/chunks/images/',
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  cacheDirectory: 'node_modules/next-build-image/caches/images/',
}

const withBuildImage = (nextConfig: NextConfig): NextConfig => {
  const enrichedConfig = Object.assign<BuildImageConfig, BuildImageConfig>(
    defaultOptions,
    nextConfig.buildImage
  )

  return Object.assign({}, nextConfig, {
    images: {
      disableStaticImages: true,
    },
    publicRuntimeConfig:
      nextConfig.publicRuntimeConfig !== undefined
        ? Object.assign(nextConfig.publicRuntimeConfig, {
            buildImage: enrichedConfig,
          })
        : { buildImage: enrichedConfig },
    webpack: (config: Configuration, options: Record<string, unknown>) => {
      config.module?.rules?.push({
        test: /\.(jpe?g|png|)$/,
        use: [
          {
            loader: 'responsive-loader',
            options: {
              name: enrichedConfig.name,
              outputPath: enrichedConfig.outputPath,
              publicPath: enrichedConfig.publicPath,
              cacheDirectory: enrichedConfig.cacheDirectory,
              adapter: require('responsive-loader/sharp'),
            },
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
