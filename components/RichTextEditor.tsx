"use client";

import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

interface RichTextEditorProps {
     value: string;
     onChange: (value: string) => void;
     placeholder?: string;
     height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
     value,
     onChange,
     placeholder = "Entrez votre HTML/CSS...",
     height = 100
}) => {
     const editorRef = useRef<any>(null);

     const handleEditorDidMount = (editor: any) => {
          editorRef.current = editor;
          
          // Add Tailwind color suggestions
          const tailwindColors = [
               'text-[var(--color-main)]',
               'text-[var(--color-secondary)]', 
               'text-white',
               'text-gray-600',
               'text-blue-600',
               'text-green-600',
               'text-red-600',
               'text-yellow-600',
               'text-purple-600',
               'bg-[var(--color-main)]',
               'bg-[var(--color-secondary)]',
               'bg-white',
               'bg-gray-100',
               'bg-blue-100',
               'bg-green-100',
               'font-bold',
               'font-semibold',
               'text-lg',
               'text-xl',
               'text-2xl',
               'text-sm',
               'text-xs'
          ];
          
          // Register completion provider for Tailwind classes
          editor.getModel()?.onDidChangeContent(() => {
               // Auto-complete Tailwind classes
          });
     };

     return (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
               <Editor
                    height={height}
                    defaultLanguage="html"
                    value={value}
                    onChange={(value) => onChange(value || '')}
                    onMount={handleEditorDidMount}
                    options={{
                         minimap: { enabled: false },
                         scrollBeyondLastLine: false,
                         fontSize: 14,
                         lineNumbers: 'off',
                         wordWrap: 'on',
                         automaticLayout: true,
                         padding: { top: 8, bottom: 8 },
                         suggest: {
                              showKeywords: true,
                              showSnippets: true,
                         },
                    }}
                    theme="vs-light"
               />
          </div>
     );
};

export default RichTextEditor;