import {
  defaultConfig,
  NextConfig,
} from 'next/dist/next-server/server/config-shared'
import { Configuration } from 'webpack'

const withBuildImage = (nextConfig: NextConfig): NextConfig => {
  return Object.assign({}, defaultConfig, nextConfig, {
    webpack: (config: Configuration) => {
      config.module?.rules?.push({
        test: /\.(jpe?g|png|)/i,
        type: 'asset',
      })

      return config
    },
  })
}

export default withBuildImage
