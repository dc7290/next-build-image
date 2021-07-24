import pluginTester from 'babel-plugin-tester'
import { join } from 'path'

import plugin from '../../src/babel'

pluginTester({
  plugin,
  fixtures: join(__dirname, '__fixtures__'),
})
