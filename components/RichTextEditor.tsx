"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import './RichTextEditor.css';

interface RichTextEditorProps {
     value: string;
     onChange: (value: string) => void;
     placeholder?: string;
     height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
     value,
     onChange,
     placeholder = "Commencez à écrire votre code HTML...",
     height = 400
}) => {
     const editorRef = useRef<any>(null);
     const [showPreview, setShowPreview] = useState(false);
     const [isFullScreen, setIsFullScreen] = useState(false);

     const handleEditorDidMount = (editor: any) => {
          editorRef.current = editor;
     };

     const insertTag = (tag: string) => {
          const editor = editorRef.current;
          if (editor) {
               const position = editor.getPosition();
               if (position) {
                    const model = editor.getModel();
                    if (model) {
                         // Get the current line content
                         const lineContent = model.getLineContent(position.lineNumber);
                         const beforeCursor = lineContent.substring(0, position.column - 1);
                         const afterCursor = lineContent.substring(position.column - 1);

                         // Create the new tag with proper formatting
                         let newText = '';
                         if (tag === 'img') {
                              newText = `\n<img src="" alt="" />\n`;
                         } else if (tag === 'a') {
                              newText = `\n<a href="">Lien</a>\n`;
                         } else {
                              newText = `\n<${tag}></${tag}>\n`;
                         }

                         // Insert the tag
                         const range = {
                              startLineNumber: position.lineNumber,
                              startColumn: position.column,
                              endLineNumber: position.lineNumber,
                              endColumn: position.column,
                         };

                         model.pushEditOperations(
                              [editor.getPosition()],
                              [{
                                   range: range,
                                   text: newText,
                              }],
                              () => null
                         );

                         // Set cursor position after the opening tag
                         const newPosition = {
                              lineNumber: position.lineNumber + 1,
                              column: tag.length + 3, // +3 for < > and position after tag name
                         };
                         editor.setPosition(newPosition);
                         editor.focus();
                    }
               }
          }
     };

     const toggleFullScreen = () => {
          setIsFullScreen(!isFullScreen);
     };

     // Handle fullscreen styles
     useEffect(() => {
          if (isFullScreen) {
               document.body.style.overflow = 'hidden';
          } else {
               document.body.style.overflow = 'unset';
          }

          return () => {
               document.body.style.overflow = 'unset';
          };
     }, [isFullScreen]);

     // Handle keyboard shortcuts
     useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
               // Keyboard shortcuts can be added here in the future
          };

          document.addEventListener('keydown', handleKeyDown);
          return () => document.removeEventListener('keydown', handleKeyDown);
     }, []);

     // Auto-format on initial load
     useEffect(() => {
          // Auto-formatting removed - now using manual tag insertion
     }, []); // Only run once on mount

     const editorContainerClass = isFullScreen
          ? 'fixed inset-0 z-50 bg-white'
          : 'border border-gray-300 rounded-lg overflow-hidden';

     const editorHeight = isFullScreen ? 'calc(100vh - 80px)' : height;

     return (
          <div className={editorContainerClass}>
               {/* Toolbar */}
               <div className="bg-gray-50 border-b border-gray-300 p-2">
                    {/* Instructions for beginners */}
                    <div className="text-xs text-gray-600 mb-2 px-1">
                         💡 <strong>Comment utiliser :</strong> Cliquez sur un bouton pour insérer un élément HTML. Puis tapez votre contenu entre les balises.
                    </div>

                    <div className="flex flex-wrap gap-1 items-center">
                         {/* Code Formatting and Validation */}
                         <div className="flex gap-1 flex-wrap">
                              {/* Headers Section */}
                              <div className="flex gap-1 border-r border-gray-300 pr-2">
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('h1')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Titre principal (grand)"
                                   >
                                        Titre 1
                                   </Button>
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('h2')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Sous-titre (moyen)"
                                   >
                                        Titre 2
                                   </Button>
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('h3')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Sous-titre (petit)"
                                   >
                                        Titre 3
                                   </Button>
                              </div>

                              {/* Text Section */}
                              <div className="flex gap-1 border-r border-gray-300 pr-2">
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('p')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Paragraphe de texte"
                                   >
                                        Texte
                                   </Button>
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('strong')}
                                        className="h-8 px-2 hover:bg-gray-200 font-bold"
                                        title="Texte en gras"
                                   >
                                        Gras
                                   </Button>
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('em')}
                                        className="h-8 px-2 hover:bg-gray-200 italic"
                                        title="Texte en italique"
                                   >
                                        Italique
                                   </Button>
                              </div>

                              {/* Lists Section */}
                              <div className="flex gap-1 border-r border-gray-300 pr-2">
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('ul')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Liste à puces"
                                   >
                                        Liste
                                   </Button>
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('ol')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Liste numérotée"
                                   >
                                        Liste num.
                                   </Button>
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('li')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Élément de liste"
                                   >
                                        Élément
                                   </Button>
                              </div>

                              {/* Media Section */}
                              <div className="flex gap-1 border-r border-gray-300 pr-2">
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('img')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Insérer une image"
                                   >
                                        Image
                                   </Button>
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('a')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Insérer un lien"
                                   >
                                        Lien
                                   </Button>
                              </div>

                              {/* Advanced Section */}
                              <div className="flex gap-1">
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('div')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Conteneur (pour organiser le contenu)"
                                   >
                                        Conteneur
                                   </Button>
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('blockquote')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Citation ou texte mis en évidence"
                                   >
                                        Citation
                                   </Button>
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertTag('code')}
                                        className="h-8 px-2 hover:bg-gray-200"
                                        title="Code ou texte technique"
                                   >
                                        Code
                                   </Button>
                              </div>
                         </div>

                         <div className="ml-auto flex gap-1">
                              <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={toggleFullScreen}
                                   className="h-8 px-2 hover:bg-gray-200"
                                   title={isFullScreen ? "Quitter le plein écran" : "Plein écran"}
                              >
                                   {isFullScreen ? <Minimize2 className="w-4 h-4 mr-1" /> : <Maximize2 className="w-4 h-4 mr-1" />}
                                   {isFullScreen ? "Réduire" : "Plein écran"}
                              </Button>
                              <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => setShowPreview(!showPreview)}
                                   className="h-8 px-2 hover:bg-gray-200"
                                   title={showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}
                              >
                                   {showPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                                   {showPreview ? "Éditer" : "Aperçu"}
                              </Button>
                         </div>
                    </div>
               </div>

               {/* Editor/Preview */}
               <div className="flex" style={{ height: editorHeight }}>
                    {/* Code Editor */}
                    <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-300`}>
                         <Editor
                              height="100%"
                              defaultLanguage="html"
                              value={value}
                              onChange={(value) => onChange(value || '')}
                              theme="vs"
                              options={{
                                   minimap: { enabled: false },
                                   fontSize: 15,
                                   fontFamily: 'Consolas, "Courier New", "Fira Code", "JetBrains Mono", monospace',
                                   lineHeight: 24,
                                   lineNumbers: 'on',
                                   roundedSelection: false,
                                   scrollBeyondLastLine: false,
                                   readOnly: false,
                                   automaticLayout: true,
                                   wordWrap: 'on',
                                   tabSize: 2,
                                   insertSpaces: true,
                                   detectIndentation: false,
                                   trimAutoWhitespace: true,
                                   largeFileOptimizations: false,
                                   renderWhitespace: 'boundary',
                                   renderControlCharacters: false,
                                   renderLineHighlight: 'all',
                                   selectOnLineNumbers: true,
                                   folding: true,
                                   foldingStrategy: 'indentation',
                                   showFoldingControls: 'always',
                                   unfoldOnClickAfterEndOfLine: false,
                                   suggest: {
                                        showKeywords: true,
                                        showSnippets: true,
                                        showClasses: true,
                                        showFunctions: true,
                                        showVariables: true,
                                        showModules: true,
                                        showProperties: true,
                                        showEvents: true,
                                        showOperators: true,
                                        showUnits: true,
                                        showValues: true,
                                        showConstants: true,
                                        showEnums: true,
                                        showEnumMembers: true,
                                        showColors: true,
                                        showFiles: true,
                                        showReferences: true,
                                        showFolders: true,
                                        showTypeParameters: true,
                                        showWords: true,
                                        showUsers: true,
                                        showIssues: true,
                                   },
                                   quickSuggestions: {
                                        other: true,
                                        comments: true,
                                        strings: true,
                                   },
                                   parameterHints: {
                                        enabled: true,
                                   },
                                   hover: {
                                        enabled: true,
                                   },
                                   contextmenu: true,
                                   mouseWheelZoom: true,
                                   bracketPairColorization: {
                                        enabled: true,
                                   },
                                   guides: {
                                        bracketPairs: true,
                                        indentation: true,
                                        highlightActiveIndentation: true,
                                   },
                                   overviewRulerBorder: false,
                                   overviewRulerLanes: 0,
                                   hideCursorInOverviewRuler: true,
                                   scrollbar: {
                                        vertical: 'visible',
                                        horizontal: 'visible',
                                        verticalScrollbarSize: 12,
                                        horizontalScrollbarSize: 12,
                                        useShadows: false,
                                        verticalHasArrows: false,
                                        horizontalHasArrows: false,
                                   },
                              }}
                              onMount={handleEditorDidMount}
                         />
                    </div>

                    {/* Preview */}
                    {showPreview && (
                         <div className="w-1/2 p-4 bg-white overflow-y-auto">
                              <div
                                   className="prose prose-sm max-w-none"
                                   dangerouslySetInnerHTML={{ __html: value || '<p>Aucun contenu à prévisualiser</p>' }}
                              />
                         </div>
                    )}
               </div>
          </div>
     );
};

export default RichTextEditor;
