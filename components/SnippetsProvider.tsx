"use client"

import { useEffect, useState } from 'react'

interface Snippets {
     headSnippets?: string
     bodyStartSnippets?: string
     bodyEndSnippets?: string
}

export default function SnippetsProvider() {
     const [snippets, setSnippets] = useState<Snippets>({})

     useEffect(() => {
          const fetchSnippets = async () => {
               try {
                    const response = await fetch('/api/content/settings')
                    if (response.ok) {
                         const data = await response.json()
                         if (data.content?.snippets) {
                              setSnippets(data.content.snippets)
                         }
                    }
               } catch (error) {
                    console.error('Error fetching snippets:', error)
               }
          }

          fetchSnippets()
     }, [])

     const injectHTMLSnippets = (htmlContent: string, type: 'head' | 'body-start' | 'body-end') => {
          if (typeof document === 'undefined') return

          // Remove existing snippets of this type
          const existingScripts = document.querySelectorAll(`script[data-snippet="${type}"]`)
          existingScripts.forEach(script => script.remove())

          // Create a temporary div to parse the HTML
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = htmlContent

          // Extract all script tags and other elements
          const elements = Array.from(tempDiv.children)

          elements.forEach((element, index) => {
               if (element.tagName === 'SCRIPT') {
                    // For script tags, create a new script element
                    const script = document.createElement('script')
                    script.setAttribute('data-snippet', `${type}-${index}`)

                    // Copy all attributes from the original script
                    Array.from(element.attributes).forEach(attr => {
                         script.setAttribute(attr.name, attr.value)
                    })

                    // Copy the content
                    script.innerHTML = element.innerHTML

                    // Inject based on type
                    if (type === 'head') {
                         document.head.appendChild(script)
                    } else if (type === 'body-start') {
                         document.body.insertBefore(script, document.body.firstChild)
                    } else {
                         document.body.appendChild(script)
                    }
               } else {
                    // For non-script elements, clone and inject them
                    const clonedElement = element.cloneNode(true) as Element
                    clonedElement.setAttribute('data-snippet', `${type}-${index}`)

                    if (type === 'head') {
                         document.head.appendChild(clonedElement)
                    } else if (type === 'body-start') {
                         document.body.insertBefore(clonedElement, document.body.firstChild)
                    } else {
                         document.body.appendChild(clonedElement)
                    }
               }
          })
     }

     useEffect(() => {
          if (snippets.headSnippets) {
               injectHTMLSnippets(snippets.headSnippets, 'head')
          }
     }, [snippets.headSnippets])

     useEffect(() => {
          if (snippets.bodyStartSnippets) {
               injectHTMLSnippets(snippets.bodyStartSnippets, 'body-start')
          }
     }, [snippets.bodyStartSnippets])

     useEffect(() => {
          if (snippets.bodyEndSnippets) {
               injectHTMLSnippets(snippets.bodyEndSnippets, 'body-end')
          }
     }, [snippets.bodyEndSnippets])

     return null
}
