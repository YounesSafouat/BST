"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TestSnippetsPage() {
     const [snippets, setSnippets] = useState<any>({})
     const [domSnippets, setDomSnippets] = useState<any>({})
     const [loading, setLoading] = useState(true)

     const fetchSnippets = async () => {
          try {
               const response = await fetch('/api/content/settings')
               if (response.ok) {
                    const data = await response.json()
                    setSnippets(data.content?.snippets || {})
               }
          } catch (error) {
               console.error('Error fetching snippets:', error)
          } finally {
               setLoading(false)
          }
     }

     const checkDomSnippets = () => {
          const headSnippets = document.querySelectorAll('[data-snippet^="head-"]')
          const bodyStartSnippets = document.querySelectorAll('[data-snippet^="body-start-"]')
          const bodyEndSnippets = document.querySelectorAll('[data-snippet^="body-end-"]')

          setDomSnippets({
               head: Array.from(headSnippets).map(el => ({
                    type: el.tagName,
                    content: el.innerHTML,
                    attributes: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`).join(' ')
               })),
               bodyStart: Array.from(bodyStartSnippets).map(el => ({
                    type: el.tagName,
                    content: el.innerHTML,
                    attributes: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`).join(' ')
               })),
               bodyEnd: Array.from(bodyEndSnippets).map(el => ({
                    type: el.tagName,
                    content: el.innerHTML,
                    attributes: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`).join(' ')
               }))
          })
     }

     const refreshSnippets = () => {
          if (typeof window !== 'undefined' && (window as any).refreshSnippets) {
               (window as any).refreshSnippets()
               setTimeout(checkDomSnippets, 500) // Check after refresh
          }
     }

     useEffect(() => {
          fetchSnippets()
          checkDomSnippets()
     }, [])

     if (loading) {
          return (
               <div className="container mx-auto py-8">
                    <div className="text-center">Chargement...</div>
               </div>
          )
     }

     return (
          <div className="container mx-auto py-8 px-4">
               <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                         <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 Test des Snippets</h1>
                         <p className="text-gray-600">Page de test pour vérifier le bon fonctionnement des snippets</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                         {/* Snippets from Database */}
                         <Card>
                              <CardHeader>
                                   <CardTitle className="flex items-center gap-2">
                                        📊 Snippets en Base de Données
                                        <Badge variant="outline">{Object.keys(snippets).filter(k => snippets[k]).length} actifs</Badge>
                                   </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   {Object.entries(snippets).map(([key, value]) => (
                                        <div key={key} className="border rounded p-3">
                                             <h4 className="font-medium text-sm text-gray-700 mb-2">{key}</h4>
                                             <div className="bg-gray-50 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
                                                  {value ? (
                                                       <pre className="whitespace-pre-wrap">{value as string}</pre>
                                                  ) : (
                                                       <span className="text-gray-400">Aucun contenu</span>
                                                  )}
                                             </div>
                                        </div>
                                   ))}
                              </CardContent>
                         </Card>

                         {/* Snippets in DOM */}
                         <Card>
                              <CardHeader>
                                   <CardTitle className="flex items-center gap-2">
                                        🌐 Snippets dans le DOM
                                        <Badge variant="outline">
                                             {domSnippets.head?.length + domSnippets.bodyStart?.length + domSnippets.bodyEnd?.length || 0} injectés
                                        </Badge>
                                   </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   {['head', 'bodyStart', 'bodyEnd'].map((type) => (
                                        <div key={type} className="border rounded p-3">
                                             <h4 className="font-medium text-sm text-gray-700 mb-2">{type}</h4>
                                             <div className="bg-gray-50 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
                                                  {domSnippets[type]?.length > 0 ? (
                                                       domSnippets[type].map((snippet: any, index: number) => (
                                                            <div key={index} className="mb-2 p-2 bg-white rounded border">
                                                                 <div className="text-xs text-gray-500 mb-1">
                                                                      {snippet.type} - {snippet.attributes}
                                                                 </div>
                                                                 <div className="text-xs">{snippet.content || 'Pas de contenu'}</div>
                                                            </div>
                                                       ))
                                                  ) : (
                                                       <span className="text-gray-400">Aucun snippet injecté</span>
                                                  )}
                                             </div>
                                        </div>
                                   ))}
                              </CardContent>
                         </Card>
                    </div>

                    {/* Actions */}
                    <Card>
                         <CardHeader>
                              <CardTitle>🔄 Actions</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div className="flex flex-wrap gap-4">
                                   <Button onClick={fetchSnippets} variant="outline">
                                        🔄 Actualiser depuis la DB
                                   </Button>
                                   <Button onClick={checkDomSnippets} variant="outline">
                                        🔍 Vérifier le DOM
                                   </Button>
                                   <Button onClick={refreshSnippets} variant="outline">
                                        ⚡ Forcer l'injection
                                   </Button>
                              </div>

                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                   <h4 className="font-semibold text-blue-900 mb-2">💡 Instructions de test</h4>
                                   <div className="text-sm text-blue-800 space-y-2">
                                        <p>1. <strong>Configurez des snippets</strong> dans les paramètres du site</p>
                                        <p>2. <strong>Sauvegardez</strong> les paramètres</p>
                                        <p>3. <strong>Revenez sur cette page</strong> et cliquez sur "Actualiser depuis la DB"</p>
                                        <p>4. <strong>Vérifiez le DOM</strong> pour voir si les snippets sont injectés</p>
                                        <p>5. <strong>Ouvrez les outils de développement</strong> (F12) pour inspecter les éléments</p>
                                   </div>
                              </div>
                         </CardContent>
                    </Card>

                    {/* Console Logs */}
                    <Card className="mt-6">
                         <CardHeader>
                              <CardTitle>📝 Logs de la Console</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                                   <p>Ouvrez la console (F12) pour voir les logs de SnippetsProvider</p>
                                   <p>Vous devriez voir des messages comme :</p>
                                   <p className="text-yellow-400">[SnippetsProvider] Injecting head snippets: ...</p>
                                   <p className="text-yellow-400">[SnippetsProvider] Successfully injected X head snippets</p>
                              </div>
                         </CardContent>
                    </Card>
               </div>
          </div>
     )
}
