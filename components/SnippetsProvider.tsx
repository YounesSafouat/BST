"use client"

import { useEffect, useState, useRef } from 'react'

interface Snippets {
     headSnippets?: string
     bodyStartSnippets?: string
     bodyEndSnippets?: string
}

export default function SnippetsProvider() {
     const [snippets, setSnippets] = useState<Snippets>({})
     const [lastFetch, setLastFetch] = useState<number>(0)
     const [showDebug, setShowDebug] = useState(false)
     const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

     const fetchSnippets = async () => {
          try {
               const response = await fetch('/api/content/settings')
               if (response.ok) {
                    const data = await response.json()
                    if (data.content?.snippets) {
                         setSnippets(data.content.snippets)
                         setLastFetch(Date.now())
                    }
               }
          } catch (error) {
               console.error('Error fetching snippets:', error)
          }
     }

     // Initial fetch
     useEffect(() => {
          fetchSnippets()
     }, [])

     // Set up periodic refresh every 30 seconds to catch updates
     useEffect(() => {
          refreshIntervalRef.current = setInterval(() => {
               fetchSnippets()
          }, 30000) // 30 seconds

          return () => {
               if (refreshIntervalRef.current) {
                    clearInterval(refreshIntervalRef.current)
               }
          }
     }, [])

     const injectHTMLSnippets = (htmlContent: string, type: 'head' | 'body-start' | 'body-end') => {
          if (typeof document === 'undefined') return

          try {
               console.log(`[SnippetsProvider] Injecting ${type} snippets:`, htmlContent)

               // Remove existing snippets of this type
               const existingScripts = document.querySelectorAll(`[data-snippet="${type}"]`)
               console.log(`[SnippetsProvider] Removing ${existingScripts.length} existing ${type} snippets`)
               existingScripts.forEach(script => script.remove())

               // If no content, don't inject anything
               if (!htmlContent || htmlContent.trim() === '') {
                    console.log(`[SnippetsProvider] No ${type} snippets to inject`)
                    return
               }

               // Create a temporary div to parse the HTML
               const tempDiv = document.createElement('div')
               tempDiv.innerHTML = htmlContent

               // Extract all script tags and other elements
               const elements = Array.from(tempDiv.children)
               console.log(`[SnippetsProvider] Found ${elements.length} elements to inject for ${type}`)

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
                              console.log(`[SnippetsProvider] Injected script ${type}-${index} into head`)
                         } else if (type === 'body-start') {
                              document.body.insertBefore(script, document.body.firstChild)
                              console.log(`[SnippetsProvider] Injected script ${type}-${index} at body start`)
                         } else {
                              document.body.appendChild(script)
                              console.log(`[SnippetsProvider] Injected script ${type}-${index} at body end`)
                         }
                    } else {
                         // For non-script elements, clone and inject them
                         const clonedElement = element.cloneNode(true) as Element
                         clonedElement.setAttribute('data-snippet', `${type}-${index}`)

                         if (type === 'head') {
                              document.head.appendChild(clonedElement)
                              console.log(`[SnippetsProvider] Injected element ${type}-${index} into head`)
                         } else if (type === 'body-start') {
                              document.body.insertBefore(clonedElement, document.body.firstChild)
                              console.log(`[SnippetsProvider] Injected element ${type}-${index} at body start`)
                         } else {
                              document.body.appendChild(clonedElement)
                              console.log(`[SnippetsProvider] Injected element ${type}-${index} at body end`)
                         }
                    }
               })

               console.log(`[SnippetsProvider] Successfully injected ${elements.length} ${type} snippets`)
          } catch (error) {
               console.error(`[SnippetsProvider] Error injecting ${type} snippets:`, error)
          }
     }

     // Inject snippets when they change
     useEffect(() => {
          if (snippets.headSnippets !== undefined) {
               injectHTMLSnippets(snippets.headSnippets, 'head')
          }
     }, [snippets.headSnippets])

     useEffect(() => {
          if (snippets.bodyStartSnippets !== undefined) {
               injectHTMLSnippets(snippets.bodyStartSnippets, 'body-start')
          }
     }, [snippets.bodyStartSnippets])

     useEffect(() => {
          if (snippets.bodyEndSnippets !== undefined) {
               injectHTMLSnippets(snippets.bodyEndSnippets, 'body-end')
          }
     }, [snippets.bodyEndSnippets])

     // Expose refresh function globally for manual refresh
     useEffect(() => {
          if (typeof window !== 'undefined') {
               (window as any).refreshSnippets = fetchSnippets
          }
     }, [])

     // Debug panel for development
     if (process.env.NODE_ENV === 'development' && showDebug) {
          return (
               <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
                    <div className="flex justify-between items-center mb-2">
                         <h3 className="text-sm font-semibold">🐛 Snippets Debug</h3>
                         <button
                              onClick={() => setShowDebug(false)}
                              className="text-gray-500 hover:text-gray-700"
                         >
                              ✕
                         </button>
                    </div>
                    <div className="text-xs space-y-1">
                         <div>Last fetch: {new Date(lastFetch).toLocaleTimeString()}</div>
                         <div>Head: {snippets.headSnippets ? '✓' : '✗'}</div>
                         <div>Body Start: {snippets.bodyStartSnippets ? '✓' : '✗'}</div>
                         <div>Body End: {snippets.bodyEndSnippets ? '✓' : '✗'}</div>
                         <button
                              onClick={fetchSnippets}
                              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                         >
                              Refresh
                         </button>
                    </div>
               </div>
          )
     }

     // Debug toggle button
     if (process.env.NODE_ENV === 'development') {
          return (
               <>
                    <button
                         onClick={() => setShowDebug(!showDebug)}
                         className="fixed bottom-4 right-4 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs z-40 hover:bg-gray-700"
                         title="Toggle Snippets Debug"
                    >
                         🐛
                    </button>
                    {null}
               </>
          )
     }

     return null
}
