import './commands'

import { mount } from 'cypress/react18'
import { ChakraProvider } from '@chakra-ui/react'
import { createElement } from 'react'
import { theme } from '../../src/theme'

// cypress/react/src/getDisplayName.ts
const getDisplayName = (node, fallbackName = 'Unknown') => {
  const type = node === null || node === void 0 ? void 0 : node.type
  if (!type) {
    return fallbackName
  }
  let displayName = null
  // The displayName property is not guaranteed to be a string.
  // It's only safe to use for our purposes if it's a string.
  // github.com/facebook/react-devtools/issues/803
  if (typeof type.displayName === 'string') {
    displayName = type.displayName
  }
  if (!displayName) {
    displayName = type.name || fallbackName
  }
  // Facebook-specific hack to turn "Image [from Image.react]" into just "Image".
  // We need displayName with module name for error reports but it clutters the DevTools.
  const match = displayName.match(/^(.*) \[from (.*)\]$/)
  if (match) {
    const componentName = match[1]
    const moduleName = match[2]
    if (componentName && moduleName) {
      if (
        moduleName === componentName ||
        moduleName.startsWith(`${componentName}.`)
      ) {
        displayName = componentName
      }
    }
  }
  return displayName
}

Cypress.Commands.add('mount', (component, options) => {
  const wrappedComponent = createElement(ChakraProvider, { theme }, component)

  const result = mount(wrappedComponent, {
    strict: true,
    log: false,
    ...options,
  })

  Cypress.log({
    name: 'mount',
    message: `<${getDisplayName(component)} ... />`,
  })

  return result
})
