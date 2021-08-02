import { NodePath } from '@babel/core'
import { JSXElement, StringLiteral } from '@babel/types'

import { Types } from '..'
import { getAttribute } from '../utils/jsx'

function transformImageComponent(t: Types, path: NodePath<JSXElement>) {
  const { attributes } = path.node.openingElement

  if (attributes.length === 0) {
    return
  }

  const srcPath = getAttribute(t, path, 'src')
  if (srcPath === undefined) {
    return
  }

  if (t.isStringLiteral(srcPath.node.value)) {
    srcPath.node.value = t.jsxExpressionContainer(
      t.callExpression(t.identifier('require'), [srcPath.node.value])
    )
    console.log(srcPath.node.value)
  }
}

export default transformImageComponent
