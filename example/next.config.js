const { withBuildImage } = require('../lib')

const config = {
  reactStrictMode: true,
}

module.exports = withBuildImage(config)
// module.exports = config
