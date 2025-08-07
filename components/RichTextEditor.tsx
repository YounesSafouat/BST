"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Link, Image as ImageIcon, Code, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
     value: string;
     onChange: (value: string) => void;
     placeholder?: string;
     height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
     value,
     onChange,
     placeholder = "Commencez à écrire votre contenu HTML...",
     height = 400
}) => {
     const editorRef = useRef<HTMLDivElement>(null);
     const [isFocused, setIsFocused] = useState(false);
     const [showPreview, setShowPreview] = useState(false);
     const [isFullScreen, setIsFullScreen] = useState(false);
     const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

     useEffect(() => {
          if (editorRef.current && value !== editorRef.current.innerHTML) {
               editorRef.current.innerHTML = value;
          }
     }, [value]);

     const updateActiveFormats = () => {
          if (!editorRef.current) return;

          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) return;

          const range = selection.getRangeAt(0);
          const formats = new Set<string>();

          // Check for bold
          if (document.queryCommandState('bold')) {
               formats.add('bold');
          }

          // Check for italic
          if (document.queryCommandState('italic')) {
               formats.add('italic');
          }

          // Check for alignment
          if (document.queryCommandValue('justifyLeft') === 'left') {
               formats.add('alignLeft');
          } else if (document.queryCommandValue('justifyCenter') === 'center') {
               formats.add('alignCenter');
          } else if (document.queryCommandValue('justifyRight') === 'right') {
               formats.add('alignRight');
          }

          // Check for headings
          const blockElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
               ? range.commonAncestorContainer.parentElement
               : range.commonAncestorContainer as Element;

          if (blockElement) {
               const tagName = blockElement.tagName.toLowerCase();
               if (tagName === 'h1') formats.add('h1');
               else if (tagName === 'h2') formats.add('h2');
               else if (tagName === 'h3') formats.add('h3');
               else if (tagName === 'blockquote') formats.add('quote');
               else if (tagName === 'pre') formats.add('code');
          }

          setActiveFormats(formats);
     };

     const execCommand = (command: string, value?: string) => {
          editorRef.current?.focus();
          
          // Special handling for formatBlock commands
          if (command === 'formatBlock') {
               document.execCommand('formatBlock', false, value);
          } else {
               document.execCommand(command, false, value);
          }
          
          updateContent();
          setTimeout(updateActiveFormats, 10);
     };

     const updateContent = () => {
          if (editorRef.current) {
               const newContent = editorRef.current.innerHTML;
               if (newContent !== value) {
                    onChange(newContent);
               }
          }
     };

     const handlePaste = (e: React.ClipboardEvent) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
          updateContent();
     };

     const insertLink = () => {
          const url = prompt('Entrez l\'URL du lien:');
          if (url) {
               execCommand('createLink', url);
          }
     };

     const insertImage = () => {
          const url = prompt('Entrez l\'URL de l\'image:');
          if (url) {
               const img = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`;
               document.execCommand('insertHTML', false, img);
               updateContent();
          }
     };

     const insertDiv = () => {
          const div = `<div style="display: flex; align-items: center; margin: 2rem 0;">
  <img src="URL_DE_L_IMAGE" alt="Description" style="width: 500px; margin-right: 5rem; border-radius: 8px;">
  <div>
    <p>Votre texte ici...</p>
  </div>
</div>`;
          document.execCommand('insertHTML', false, div);
          updateContent();
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

     const editorContainerClass = isFullScreen
          ? 'fixed inset-0 z-50 bg-white'
          : 'border border-gray-300 rounded-lg overflow-hidden';

     const editorHeight = isFullScreen ? 'calc(100vh - 80px)' : height;

     const toolbarButtons = [
          { icon: Bold, command: 'bold', title: 'Gras', format: 'bold' },
          { icon: Italic, command: 'italic', title: 'Italique', format: 'italic' },
          { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Titre 1', format: 'h1' },
          { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Titre 2', format: 'h2' },
          { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Titre 3', format: 'h3' },
          { icon: List, command: 'insertUnorderedList', title: 'Liste à puces' },
          { icon: ListOrdered, command: 'insertOrderedList', title: 'Liste numérotée' },
          { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Citation', format: 'quote' },
          { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code', format: 'code' },
          { icon: AlignLeft, command: 'justifyLeft', title: 'Aligner à gauche', format: 'alignLeft' },
          { icon: AlignCenter, command: 'justifyCenter', title: 'Centrer', format: 'alignCenter' },
          { icon: AlignRight, command: 'justifyRight', title: 'Aligner à droite', format: 'alignRight' },
     ];

     return (
          <div className={editorContainerClass}>
               {/* Toolbar */}
               <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
                    <div className="flex gap-1">
                         {toolbarButtons.map((button, index) => {
                              const isActive = button.format ? activeFormats.has(button.format) : false;
                              return (
                                   <Button
                                        key={index}
                                        variant={isActive ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => execCommand(button.command, button.value)}
                                        className={`h-8 w-8 p-0 ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-200'}`}
                                        title={button.title}
                                   >
                                        <button.icon className="w-4 h-4" />
                                   </Button>
                              );
                         })}
                    </div>

                    <div className="border-l border-gray-300 mx-2 h-6" />

                    <div className="flex gap-1">
                         <Button
                              variant="ghost"
                              size="sm"
                              onClick={insertLink}
                              className="h-8 px-2 hover:bg-gray-200"
                              title="Insérer un lien"
                         >
                              <Link className="w-4 h-4 mr-1" />
                              Lien
                         </Button>
                         <Button
                              variant="ghost"
                              size="sm"
                              onClick={insertImage}
                              className="h-8 px-2 hover:bg-gray-200"
                              title="Insérer une image"
                         >
                              <ImageIcon className="w-4 h-4 mr-1" />
                              Image
                         </Button>
                         <Button
                              variant="ghost"
                              size="sm"
                              onClick={insertDiv}
                              className="h-8 px-2 hover:bg-gray-200"
                              title="Insérer un div avec image"
                         >
                              Div + Image
                         </Button>
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

               {/* Editor/Preview */}
               <div className="flex" style={{ height: editorHeight }}>
                    {/* HTML Editor */}
                    <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-300`}>
                         <div
                              ref={editorRef}
                              contentEditable
                              onInput={updateContent}
                              onFocus={() => setIsFocused(true)}
                              onBlur={() => setIsFocused(false)}
                              onPaste={handlePaste}
                              onKeyUp={updateActiveFormats}
                              onMouseUp={updateActiveFormats}
                              onKeyDown={(e) => {
                                   if (e.key === 'Enter') {
                                        e.preventDefault();
                                        document.execCommand('insertParagraph', false);
                                        updateContent();
                                   }
                              }}
                              className={`w-full p-4 outline-none resize-none ${isFocused ? 'bg-white' : 'bg-gray-50'
                                   }`}
                               style={{
                                    height: '100%',
                                    overflowY: 'auto',
                                    direction: 'ltr',
                                    textAlign: 'left',
                                    unicodeBidi: 'normal'
                               }}
                               data-placeholder={placeholder}
                               suppressContentEditableWarning={true}
                          />
                          <style jsx>{`
                               [contenteditable="true"] {
                                    line-height: 1.7;
                                    color: #374151;
                               }
                               [contenteditable="true"] h1 {
                                    font-size: 2rem;
                                    font-weight: bold;
                                    color: #111827;
                                    margin: 2rem 0 1rem 0;
                                    line-height: 1.2;
                               }
                               [contenteditable="true"] h2 {
                                    font-size: 1.5rem;
                                    font-weight: bold;
                                    color: #374151;
                                    margin: 1.5rem 0 1rem 0;
                                    line-height: 1.3;
                               }
                               [contenteditable="true"] h3 {
                                    font-size: 1.25rem;
                                    font-weight: bold;
                                    color: #4b5563;
                                    margin: 1rem 0 0.5rem 0;
                                    line-height: 1.4;
                               }
                               [contenteditable="true"] p {
                                    margin: 1rem 0;
                                    line-height: 1.7;
                               }
                               [contenteditable="true"] ul, [contenteditable="true"] ol {
                                    margin: 1rem 0;
                                    padding-left: 2rem;
                               }
                               [contenteditable="true"] li {
                                    margin: 0.5rem 0;
                               }
                               [contenteditable="true"] strong {
                                    font-weight: bold;
                                    color: #111827;
                               }
                               [contenteditable="true"] em {
                                    font-style: italic;
                                    color: #4b5563;
                               }
                               [contenteditable="true"] img {
                                    max-width: 100%;
                                    height: auto;
                                    border-radius: 8px;
                                    margin: 1rem 0;
                               }
                               [contenteditable="true"] a {
                                    color: #2563eb;
                                    text-decoration: underline;
                               }
                               [contenteditable="true"] a:hover {
                                    color: #1d4ed8;
                               }
                               [contenteditable="true"] blockquote {
                                    border-left: 4px solid #3b82f6;
                                    padding-left: 1rem;
                                    margin: 1rem 0;
                                    font-style: italic;
                                    background-color: #f9fafb;
                                    padding: 1rem;
                                    border-radius: 0 8px 8px 0;
                               }
                               [contenteditable="true"] code {
                                    background-color: #f3f4f6;
                                    padding: 0.25rem 0.5rem;
                                    border-radius: 4px;
                                    font-family: monospace;
                                    font-size: 0.875rem;
                               }
                               [contenteditable="true"] pre {
                                    background-color: #1f2937;
                                    color: #f9fafb;
                                    padding: 1rem;
                                    border-radius: 8px;
                                    overflow-x: auto;
                                    margin: 1rem 0;
                               }
                               [contenteditable="true"] pre code {
                                    background: none;
                                    padding: 0;
                                    color: inherit;
                               }
                          `}</style>
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
