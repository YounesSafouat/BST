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

     useEffect(() => {
          if (snippets.headSnippets && typeof document !== 'undefined') {
               // Remove existing head snippets
               const existingScripts = document.querySelectorAll('script[data-snippet="head"]')
               existingScripts.forEach(script => script.remove())

               // Create and inject new script
               const script = document.createElement('script')
               script.innerHTML = snippets.headSnippets
               script.setAttribute('data-snippet', 'head')
               document.head.appendChild(script)
          }
     }, [snippets.headSnippets])

     useEffect(() => {
          if (snippets.bodyStartSnippets && typeof document !== 'undefined') {
               // Remove existing body start snippets
               const existingScripts = document.querySelectorAll('script[data-snippet="body-start"]')
               existingScripts.forEach(script => script.remove())

               // Create and inject new script
               const script = document.createElement('script')
               script.innerHTML = snippets.bodyStartSnippets
               script.setAttribute('data-snippet', 'body-start')
               document.body.insertBefore(script, document.body.firstChild)
          }
     }, [snippets.bodyStartSnippets])

     useEffect(() => {
          if (snippets.bodyEndSnippets && typeof document !== 'undefined') {
               // Remove existing body end snippets
               const existingScripts = document.querySelectorAll('script[data-snippet="body-end"]')
               existingScripts.forEach(script => script.remove())

               // Create and inject new script
               const script = document.createElement('script')
               script.innerHTML = snippets.bodyEndSnippets
               script.setAttribute('data-snippet', 'body-end')
               document.body.appendChild(script)
          }
     }, [snippets.bodyEndSnippets])

     return null
}
