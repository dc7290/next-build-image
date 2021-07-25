import { JSXElement, JSXAttribute, JSXOpeningElement } from '@babel/types'
import { NodePath } from '@babel/core'
import { Types } from '..'

export const getAttribute = (
  t: Types,
  path: NodePath<JSXElement>,
  attributeName: string
): NodePath<JSXAttribute> | undefined => {
  if (
    t.isJSXElement(path.node) &&
    path.node.openingElement.attributes.length !== 0
  ) {
    let attribute
    ;(path.get('openingElement') as NodePath<JSXOpeningElement>).traverse({
      JSXAttribute(attributePath) {
        if (attributePath.node.name.name === attributeName) {
          attribute = attributePath
          attributePath.stop()
        }
      },
    })

    return attribute
  }
}

// export const getBooleanAttribute = (
//   path: NodePath<JSXElement>,
//   attributeName: string
// ): boolean | undefined => {
//   const attribute = getAttribute(path, attributeName)

//   if (attribute) {
//     if (attribute.node.value === null) {
//       return true
//     }

//     if (
//       attribute.node.value.type === 'JSXExpressionContainer' &&
//       attribute.node.value.expression.type === 'BooleanLiteral'
//     ) {
//       return attribute.node.value.expression.value
//     }

//     // todo: better error message with link to docs when ready & create test for this error
//     throw attribute
//       .get('value')
//       .buildCodeFrameError('Only static boolean values are allowed')
//   }

//   return undefined
// }

// export const getTypeAttribute = (
//   path: NodePath<JSXElement>,
//   types: string[]
// ): string | undefined => {
//   const attribute = getAttribute(path, 'type')

//   if (
//     attribute &&
//     attribute.node.value &&
//     attribute.node.value.type === 'StringLiteral'
//   ) {
//     const type = attribute.node.value.value

//     if (types.indexOf(type) < 0) {
//       throw (
//         attribute.get('value') as NodePath<JSXExpressionContainer>
//       ).buildCodeFrameError(`Type ${type} not found in images.config.js`)
//     }

//     return type
//   }

//   if (attribute && attribute.node) {
//     throw (attribute.get('value') as NodePath).buildCodeFrameError(
//       'Only static string values are allowed'
//     )
//   }
// }

// export const getNumberedArrayAttribute = (
//   path: NodePath<JSXElement>,
//   attributeName: string
// ): number[] | undefined => {
//   const attribute = getAttribute(path, attributeName)

//   if (attribute) {
//     if (
//       attribute.node.value &&
//       attribute.node.value.type === 'JSXExpressionContainer' &&
//       attribute.node.value.expression.type === 'ArrayExpression'
//     ) {
//       const values: number[] = []

//       attribute.node.value.expression.elements.forEach((element, i) => {
//         if (element && element.type === 'NumericLiteral') {
//           values.push(element.value)
//         } else if (element) {
//           // todo: better error message with link to docs when ready & create test for this error
//           throw (
//             (
//               (attribute.get('value') as NodePath<JSXExpressionContainer>).get(
//                 'expression'
//               ) as NodePath<ArrayExpression>
//             ).get(`elements.${i}`) as NodePath
//           ).buildCodeFrameError('Only static number values are allowed')
//         }
//       })

//       return values
//     }

//     // todo: better error message with link to docs when ready & create test for this error
//     throw attribute
//       .get('value')
//       .buildCodeFrameError('Only static array with number values is allowed')
//   }

//   return undefined
// }
