import { NodePath } from '@babel/core'
import { JSXElement } from '@babel/types'

import { Types } from '..'

function resolveJsxComponent(
  t: Types,
  path: NodePath<JSXElement>
): string | undefined {
  if (
    t.isJSXOpeningElement(path.node.openingElement) &&
    t.isJSXIdentifier(path.node.openingElement.name)
  ) {
    return path.node.openingElement.name.name
  }
}

export default resolveJsxComponent
