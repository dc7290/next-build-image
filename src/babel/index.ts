import { types as t, NodePath, PluginObj } from '@babel/core'
import pluginSyntaxJsx from '@babel/plugin-syntax-jsx'

function transform(_api: typeof t): PluginObj {
  return {
    inherits: pluginSyntaxJsx,
    visitor: {},
  }
}

export default transform
