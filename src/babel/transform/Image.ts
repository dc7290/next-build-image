import { NodePath } from '@babel/core'
import { JSXAttribute, JSXElement } from '@babel/types'

import { Types } from '..'
import { getAttribute } from '../utils/jsx'

function transformImageComponent(t: Types, path: NodePath<JSXElement>) {
  const { attributes } = path.node.openingElement

  if (attributes.length === 0) {
    return
  }

  const srcPath = getAttribute(t, path, 'src')
  if (
    srcPath === undefined ||
    srcPath.node.value === null ||
    srcPath.node.value === undefined
  ) {
    return
  }

  if (srcPath.node.value.type === 'StringLiteral') {
    srcPath.get('value')
  }
}

export default transformImageComponent
