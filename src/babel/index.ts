import { PluginObj } from '@babel/core'
import * as t from '@babel/types'
import pluginSyntaxJsx from '@babel/plugin-syntax-jsx'
import resolveJsxComponent from './utils/resolveJsxComponents'
import transformImageComponent from './transform/Image'

export type Types = typeof t

function transform({ types }: { types: Types }): PluginObj {
  return {
    inherits: pluginSyntaxJsx,
    visitor: {
      JSXElement: (path) => {
        const component = resolveJsxComponent(types, path)

        if (component === 'Image') {
          transformImageComponent(types, path)
        }
      },
    },
  }
}

export default transform
