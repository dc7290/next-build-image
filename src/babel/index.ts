import { PluginObj } from '@babel/core'
import * as t from '@babel/types'
import pluginSyntaxJsx from '@babel/plugin-syntax-jsx'
import resolveJsxComponent from './utils/resolveJsxComponents'
import transformImageComponent from './transform/Image'

export type Types = typeof t

function transform(_api: Types): PluginObj {
  return {
    inherits: pluginSyntaxJsx,
    visitor: {
      JSXElement: (path) => {
        const component = resolveJsxComponent(_api, path)

        if (component === 'Image') {
          transformImageComponent(_api, path)
        }
      },
    },
  }
}

export default transform
