const { withBuildImage } = require('../lib/plugin')

const config = {
  reactStrictMode: true,
}

module.exports = withBuildImage(config)
// module.exports = config
