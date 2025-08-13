"use client"

import { useEffect, useState } from 'react'

export default function FaviconProvider() {
     const [faviconUrl, setFaviconUrl] = useState<string>('')

     useEffect(() => {
          const loadFavicon = async () => {
               try {
                    const response = await fetch('/api/content/settings')
                    if (response.ok) {
                         const data = await response.json()
                         if (data?.content?.favicon?.image) {
                              setFaviconUrl(data.content.favicon.image)
                         } else {
                              console.log('No favicon found in settings, using default')
                         }
                    }
               } catch (error) {
                    console.error('Error loading favicon from settings:', error)
               }
          }

          loadFavicon()
     }, [])

     // Use React to render the favicon link instead of direct DOM manipulation
     if (!faviconUrl) return null

     return (
          <link
               rel="icon"
               href={faviconUrl}
          />
     )
} 