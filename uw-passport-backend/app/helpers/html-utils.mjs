import { JSDOM } from 'jsdom'
import serialize from 'w3c-xmlserializer'

export const jsdomDocumentToXhtml = document => {
  const temp = serialize(document.documentElement)
    .replace(' xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml"', ' xmlns="http://www.w3.org/1999/xhtml"')
  return '<?xml version=\'1.0\' encoding=\'UTF-8\' ?>'
    + '\n<!DOCTYPE html>\n'
    + temp
}


// document.body
export const jsdomBodyToXml = documentBody => {
  return serialize(documentBody)
    .replace(' xmlns="http://www.w3.org/1999/xhtml"', '')
    .replace(/<body[^>]*>/, '')
    .replace('</body>', '')
}

export const jsdomNodeToXml = node => {
  return serialize(node)
    .replace(' xmlns="http://www.w3.org/1999/xhtml"', '')
}

export const htmlToDocument = html => {
  const { document } = (new JSDOM(html)).window
  return document
}

// Tham khảo https://github.com/jitbit/HtmlSanitizer

const _tagWhitelist = {
  A: true,
  ABBR: true,
  B: true,
  BLOCKQUOTE: true,
  BODY: true,
  BR: true,
  CENTER: true,
  CODE: true,
  DD: true,
  DIV: true,
  DL: true,
  DT: true,
  EM: true,
  FONT: true,
  H1: true,
  H2: true,
  H3: true,
  H4: true,
  H5: true,
  H6: true,
  HR: true,
  I: true,
  IMG: true,
  LABEL: true,
  LI: true,
  OL: true,
  P: true,
  PRE: true,
  SMALL: true,
  SOURCE: true,
  SPAN: true,
  STRONG: true,
  SUB: true,
  SUP: true,
  TABLE: true,
  TBODY: true,
  TR: true,
  TD: true,
  TH: true,
  THEAD: true,
  UL: true,
  U: true,
  VIDEO: true,
  // SVG: true,
}

// tags that will be converted to DIVs
const _contentTagWhiteList = {
  // FORM: true,
  // 'GOOGLE-SHEETS-HTML-ORIGIN': true,
}

const _attributeWhitelist = {
  align: true,
  color: true,
  controls: true,
  height: true,
  href: true,
  id: true,
  src: true,
  style: true,
  target: true,
  title: true,
  type: true,
  width: true,
}

const _cssWhitelist = {
  'background-color': true,
  color: true,
  'font-size': true,
  'font-weight': true,
  'text-align': true,
  'text-decoration': true,
  width: true,
}

// which "protocols" are allowed in "href", "src" etc
const _schemaWhiteList = [
  'http:',
  'https:',
  'data:',
  'm-files:',
  'file:',
  'ftp:',
  'mailto:',
  'pw:',
]

const _uriAttributes = {
  href: true,
  action: true,
}

const makeSanitizedCopy = (document, node) => {
  let newNode
  if (node.nodeType == 3) { // Node.TEXT_NODE
    // node.tagName là undefined
    newNode = node.cloneNode(true)
  } else if (node.nodeType == 1 /* Node.ELEMENT_NODE */
    && (
      _tagWhitelist[node.tagName]
      || _contentTagWhiteList[node.tagName]
    )
  ) {
    // is tag allowed?
    if (_contentTagWhiteList[node.tagName]) {
      // convert to DIV
      newNode = document.createElement('DIV')
    } else {
      newNode = document.createElement(node.tagName)
    }

    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i]
      if (_attributeWhitelist[attr.name]) {
        if (attr.name == 'style') {
          for (let s = 0; s < node.style.length; s++) {
            const styleName = node.style[s]
            if (_cssWhitelist[styleName]) {
              newNode.style.setProperty(styleName, node.style.getPropertyValue(styleName))
            }
          }
        } else {
          if (_uriAttributes[attr.name]) {
            // if this is a "uri" attribute, that can have "javascript:" or something
            if (attr.value.indexOf(':') > -1
              && ! startsWithAny(attr.value, _schemaWhiteList)) {
              continue
            }
          }
          newNode.setAttribute(attr.name, attr.value)
        }
      }
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      const subCopy = makeSanitizedCopy(document, node.childNodes[i])
      newNode.appendChild(subCopy, false)
    }

    // remove useless empty spans (lots of those when pasting from MS Outlook)
    if (['SPAN', 'B', 'I', 'U'].includes(newNode.tagName)
      && newNode.innerHTML.trim() == '') {
      return document.createDocumentFragment()
    }
  } else {
    newNode = document.createDocumentFragment()
  }
  return newNode
}

export const sanitizeHtml = html => {
  html = html ?? ''
  html = html.trim()
  if (html == '') {
    return ''
  }

  if (html.indexOf('<body') == -1) {
    html = '<body>' + html + '</body>'
  }

  const document = htmlToDocument(html)
  const sanitizedBody = makeSanitizedCopy(document, document.body)

  /*
  // replace is just for cleaner code
  return sanitizedBody.innerHTML
    .replace(/<br[^>]*>(\S)/g, '<br>\n$1')
    .replace(/div><div/g, 'div>\n<div')
  */

  return jsdomBodyToXml(sanitizedBody)
}

const startsWithAny = (str, substrings) => {
  for (let i = 0; i < substrings.length; i++) {
    if (str.indexOf(substrings[i]) == 0) {
      return true
    }
  }
  return false
}
