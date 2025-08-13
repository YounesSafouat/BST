"use client";

import { useEffect, useState } from 'react';

interface Snippet {
     _id?: string;
     title: string;
     description: string;
     type: 'meta' | 'script' | 'analytics' | 'tracking' | 'custom';
     location: 'head' | 'body-top' | 'body-bottom';
     content: string;
     isActive: boolean;
     pages?: string[];
     priority?: number;
}

interface SnippetsData {
     snippets: Snippet[];
}

export default function SnippetsInjector() {
     const [snippets, setSnippets] = useState<Snippet[]>([]);
     const [loading, setLoading] = useState(true);
     const [isMounted, setIsMounted] = useState(false);
     const [error, setError] = useState<string | null>(null);

     // Early return for SSR
     if (typeof window === 'undefined') {
          return null;
     }

     // Return null if there's an error to prevent crashes
     if (error) {
          console.warn('SnippetsInjector error:', error);
          return null;
     }

     useEffect(() => {
          try {
               setIsMounted(true);
               fetchSnippets();
          } catch (error) {
               console.error('SnippetsInjector initialization error:', error);
               setError('Failed to initialize snippets');
          }
     }, []);

     const fetchSnippets = async () => {
          try {
               const response = await fetch('/api/content/snippets');
               if (response.ok) {
                    const data = await response.json();
                    console.log('SnippetsInjector - Fetched data:', data); // Debug log

                    if (data.length > 0) {
                         const snippetsContent = data.find(item => item.type === 'snippets');
                         if (snippetsContent && snippetsContent.content?.snippets) {
                              console.log('SnippetsInjector - Content snippets:', snippetsContent.content.snippets); // Debug log
                              // Sort by priority
                              const sortedSnippets = snippetsContent.content.snippets
                                   .filter((snippet: Snippet) => snippet.isActive)
                                   .sort((a: Snippet, b: Snippet) => (a.priority || 0) - (b.priority || 0));
                              console.log('SnippetsInjector - Sorted snippets:', sortedSnippets); // Debug log
                              setSnippets(sortedSnippets);
                         } else {
                              console.log('SnippetsInjector - No snippets found in data'); // Debug log
                         }
                    }
               }
          } catch (error) {
               console.error('Error fetching snippets:', error);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (snippets.length === 0 || loading || !isMounted) return;

          // Check if DOM is ready
          if (typeof document === 'undefined' || !document.head || !document.body) {
               console.log('DOM not ready, skipping snippet injection');
               return;
          }

          // Inject snippets based on their location
          snippets.forEach((snippet) => {
               if (!snippet.isActive) return;

               try {
                    // Check if snippet should apply to current page
                    const currentPath = window.location.pathname;
                    const shouldApply = !snippet.pages || snippet.pages.length === 0 || snippet.pages.includes(currentPath);

                    if (!shouldApply) return;

                    switch (snippet.location) {
                         case 'head':
                              injectInHead(snippet.content);
                              break;
                         case 'body-top':
                              injectInBodyTop(snippet.content);
                              break;
                         case 'body-bottom':
                              injectInBodyBottom(snippet.content);
                              break;
                    }
               } catch (error) {
                    console.error('Error injecting snippet:', snippet.title, error);
               }
          });

          // Cleanup function to prevent memory leaks
          return () => {
               // Note: We don't remove injected elements on cleanup to avoid breaking functionality
               // The browser will clean up when the page unloads
          };
     }, [snippets, loading]);

     const injectInHead = (content: string) => {
          try {
               // Check if DOM is ready
               if (typeof document === 'undefined' || !document.head) {
                    console.log('Document head not available, skipping head injection');
                    return;
               }

               // Create a temporary div to parse HTML
               const temp = document.createElement('div');
               temp.innerHTML = content;

               // Handle different types of content
               const scripts = temp.querySelectorAll('script');
               const links = temp.querySelectorAll('link');
               const metas = temp.querySelectorAll('meta');
               const styles = temp.querySelectorAll('style');

               // Inject meta tags (with duplicate detection)
               metas.forEach(meta => {
                    // Check if this meta tag already exists
                    const existingMeta = document.querySelector(`meta[name="${meta.getAttribute('name')}"], meta[property="${meta.getAttribute('property')}"]`);
                    if (existingMeta) {
                         console.log('Meta tag already exists, skipping:', meta.outerHTML);
                         return; // Skip if already exists
                    }

                    const newMeta = document.createElement('meta');
                    Array.from(meta.attributes).forEach(attr => {
                         newMeta.setAttribute(attr.name, attr.value);
                    });
                    document.head.appendChild(newMeta);
               });

               // Inject link tags (CSS, etc.) - with duplicate detection
               links.forEach(link => {
                    const href = link.getAttribute('href');
                    const rel = link.getAttribute('rel');

                    // Check if this link already exists
                    const existingLink = document.querySelector(`link[href="${href}"], link[rel="${rel}"]`);
                    if (existingLink) {
                         console.log('Link already exists, skipping:', link.outerHTML);
                         return; // Skip if already exists
                    }

                    const newLink = document.createElement('link');
                    Array.from(link.attributes).forEach(attr => {
                         newLink.setAttribute(attr.name, attr.value);
                    });
                    document.head.appendChild(newLink);
               });

               // Inject style tags - with duplicate detection
               styles.forEach(style => {
                    const styleContent = style.textContent;

                    // Check if this style content already exists
                    const existingStyle = Array.from(document.querySelectorAll('style')).find(s => s.textContent === styleContent);
                    if (existingStyle) {
                         console.log('Style already exists, skipping');
                         return; // Skip if already exists
                    }

                    const newStyle = document.createElement('style');
                    newStyle.textContent = style.textContent;
                    document.head.appendChild(newStyle);
               });

               // Inject script tags - with duplicate detection
               scripts.forEach(script => {
                    const src = script.getAttribute('src');
                    const scriptContent = script.textContent;

                    // Check if this script already exists
                    if (src) {
                         const existingScript = document.querySelector(`script[src="${src}"]`);
                         if (existingScript) {
                              console.log('Script with src already exists, skipping:', src);
                              return; // Skip if already exists
                         }
                    } else if (scriptContent) {
                         const existingScript = Array.from(document.querySelectorAll('script')).find(s => s.textContent === scriptContent);
                         if (existingScript) {
                              console.log('Script content already exists, skipping');
                              return; // Skip if already exists
                         }
                    }

                    const newScript = document.createElement('script');
                    Array.from(script.attributes).forEach(attr => {
                         if (attr.name !== 'src') {
                              newScript.setAttribute(attr.name, attr.value);
                         }
                    });
                    if (script.src) {
                         newScript.src = script.src;
                    } else {
                         newScript.textContent = script.textContent;
                    }
                    document.head.appendChild(newScript);
               });

               // Handle raw text content (like meta tags written as strings)
               if (temp.children.length === 0 && content.trim()) {
                    const rawContent = content.trim();
                    if (rawContent.startsWith('<meta') || rawContent.startsWith('<link') || rawContent.startsWith('<script') || rawContent.startsWith('<style')) {
                         const newElement = document.createElement('div');
                         newElement.innerHTML = rawContent;
                         const element = newElement.firstElementChild;
                         if (element) {
                              document.head.appendChild(element.cloneNode(true));
                         }
                    }
               }
          } catch (error) {
               console.error('Error in injectInHead:', error);
          }
     };

     const injectInBodyTop = (content: string) => {
          try {
               // Check if DOM is ready
               if (typeof document === 'undefined' || !document.body) {
                    console.log('Document body not available, skipping body-top injection');
                    return;
               }

               const temp = document.createElement('div');
               temp.innerHTML = content;

               const scripts = temp.querySelectorAll('script');
               const divs = temp.querySelectorAll('div');
               const spans = temp.querySelectorAll('span');

               // Inject scripts - with duplicate detection
               scripts.forEach(script => {
                    const src = script.getAttribute('src');
                    const scriptContent = script.textContent;

                    // Check if this script already exists
                    if (src) {
                         const existingScript = document.querySelector(`script[src="${src}"]`);
                         if (existingScript) {
                              console.log('Script with src already exists, skipping:', src);
                              return; // Skip if already exists
                         }
                    } else if (scriptContent) {
                         const existingScript = Array.from(document.querySelectorAll('script')).find(s => s.textContent === scriptContent);
                         if (existingScript) {
                              console.log('Script content already exists, skipping');
                              return; // Skip if already exists
                         }
                    }

                    const newScript = document.createElement('script');
                    Array.from(script.attributes).forEach(attr => {
                         if (attr.name !== 'src') {
                              newScript.setAttribute(attr.name, attr.value);
                         }
                    });
                    if (script.src) {
                         newScript.src = script.src;
                    } else {
                         newScript.textContent = script.textContent;
                    }
                    document.body.insertBefore(newScript, document.body.firstChild);
               });

               // Inject other elements
               [...divs, ...spans].forEach(element => {
                    const newElement = document.createElement(element.tagName.toLowerCase());
                    newElement.innerHTML = element.innerHTML;
                    Array.from(element.attributes).forEach(attr => {
                         newElement.setAttribute(attr.name, attr.value);
                    });
                    document.body.insertBefore(newElement, document.body.firstChild);
               });

               // Handle raw content
               if (temp.children.length === 0 && content.trim()) {
                    const rawContent = content.trim();
                    if (rawContent.startsWith('<script') || rawContent.startsWith('<div') || rawContent.startsWith('<span')) {
                         const newElement = document.createElement('div');
                         newElement.innerHTML = rawContent;
                         const element = newElement.firstElementChild;
                         if (element) {
                              document.body.insertBefore(element.cloneNode(true), document.body.firstChild);
                         }
                    }
               }
          } catch (error) {
               console.error('Error in injectInBodyTop:', error);
          }
     };

     const injectInBodyBottom = (content: string) => {
          try {
               // Check if DOM is ready
               if (typeof document === 'undefined' || !document.body) {
                    console.log('Document body not available, skipping body-bottom injection');
                    return;
               }

               const temp = document.createElement('div');
               temp.innerHTML = content;

               const scripts = temp.querySelectorAll('script');
               const divs = temp.querySelectorAll('div');
               const spans = temp.querySelectorAll('span');

               // Inject scripts - with duplicate detection
               scripts.forEach(script => {
                    const src = script.getAttribute('src');
                    const scriptContent = script.textContent;

                    // Check if this script already exists
                    if (src) {
                         const existingScript = document.querySelector(`script[src="${src}"]`);
                         if (existingScript) {
                              console.log('Script with src already exists, skipping:', src);
                              return; // Skip if already exists
                         }
                    } else if (scriptContent) {
                         const existingScript = Array.from(document.querySelectorAll('script')).find(s => s.textContent === scriptContent);
                         if (existingScript) {
                              console.log('Script content already exists, skipping');
                              return; // Skip if already exists
                         }
                    }

                    const newScript = document.createElement('script');
                    Array.from(script.attributes).forEach(attr => {
                         if (attr.name !== 'src') {
                              newScript.setAttribute(attr.name, attr.value);
                         }
                    });
                    if (script.src) {
                         newScript.src = script.src;
                    } else {
                         newScript.textContent = script.textContent;
                    }
                    document.body.appendChild(newScript);
               });

               // Inject other elements
               [...divs, ...spans].forEach(element => {
                    const newElement = document.createElement(element.tagName.toLowerCase());
                    newElement.innerHTML = element.innerHTML;
                    Array.from(element.attributes).forEach(attr => {
                         newElement.setAttribute(attr.name, attr.value);
                    });
                    document.body.appendChild(newElement);
               });

               // Handle raw content
               if (temp.children.length === 0 && content.trim()) {
                    const rawContent = content.trim();
                    if (rawContent.startsWith('<script') || rawContent.startsWith('<div') || rawContent.startsWith('<span')) {
                         const newElement = document.createElement('div');
                         newElement.innerHTML = rawContent;
                         const element = newElement.firstElementChild;
                         if (element) {
                              document.body.appendChild(element.cloneNode(true));
                         }
                    }
               }
          } catch (error) {
               console.error('Error in injectInBodyBottom:', error);
          }
     };

     // This component doesn't render anything visible
     // Also prevent SSR issues
     if (typeof window === 'undefined') {
          return null;
     }

     return null;
}
