"use client"

import { useEffect } from 'react'

export default function FaviconProvider() {
     useEffect(() => {
          const loadFavicon = async () => {
               try {
                    const response = await fetch('/api/content/settings')
                    if (response.ok) {
                         const data = await response.json()
                         if (data?.content?.favicon?.image) {
                              // Remove existing favicon links
                              const existingLinks = document.querySelectorAll('link[rel*="icon"]')
                              existingLinks.forEach(link => link.remove())

                              // Add new favicon
                              const link = document.createElement('link')
                              link.rel = 'icon'
                              link.href = data.content.favicon.image
                              if (data.content.favicon.alt) {
                                   link.setAttribute('alt', data.content.favicon.alt)
                              }
                              document.head.appendChild(link)
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

     return null
} 