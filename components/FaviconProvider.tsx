/**
 * FaviconProvider.tsx
 * 
 * Favicon provider component that dynamically loads and sets the website
 * favicon from CMS settings. This component fetches favicon data and
 * renders the appropriate favicon link element.
 * 
 * WHERE IT'S USED:
 * - Root layout (/app/layout.tsx) - Global favicon provider
 * - Automatically included in every page through the root layout
 * - Provides dynamic favicon management
 * 
 * KEY FEATURES:
 * - Dynamic favicon loading from CMS API
 * - Fallback to default favicon when none specified
 * - Error handling and logging
 * - React-based favicon rendering
 * - Automatic favicon updates from settings
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and client-side rendering
 * - Fetches favicon data from /api/content/settings endpoint
 * - Implements error handling and fallback logic
 * - Renders favicon link element dynamically
 * - Handles loading states and error conditions
 * - Integrates with CMS content management system
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

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