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
               const script = document.createElement('script')
               script.innerHTML = snippets.headSnippets
               document.head.appendChild(script)
          }
     }, [snippets.headSnippets])

     useEffect(() => {
          if (snippets.bodyStartSnippets && typeof document !== 'undefined') {
               const script = document.createElement('script')
               script.innerHTML = snippets.bodyStartSnippets
               document.body.insertBefore(script, document.body.firstChild)
          }
     }, [snippets.bodyStartSnippets])

     useEffect(() => {
          if (snippets.bodyEndSnippets && typeof document !== 'undefined') {
               const script = document.createElement('script')
               script.innerHTML = snippets.bodyEndSnippets
               document.body.appendChild(script)
          }
     }, [snippets.bodyEndSnippets])

     return null
}
