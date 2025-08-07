"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Link, Image as ImageIcon, Code, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Commencez à écrire votre contenu en markdown...",
  height = 400
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = before + (selectedText || placeholder) + after;
    
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
    
    // Set cursor position
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = start + before.length + (selectedText ? selectedText.length : placeholder.length);
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newValue = value.substring(0, start) + text + value.substring(start);
    onChange(newValue);
    
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = start + text.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**', 'texte en gras'), title: 'Gras' },
    { icon: Italic, action: () => insertText('*', '*', 'texte en italique'), title: 'Italique' },
    { icon: Heading1, action: () => insertText('# ', '', 'Titre 1'), title: 'Titre 1' },
    { icon: Heading2, action: () => insertText('## ', '', 'Titre 2'), title: 'Titre 2' },
    { icon: Heading3, action: () => insertText('### ', '', 'Titre 3'), title: 'Titre 3' },
    { icon: List, action: () => insertText('- ', '', 'élément de liste'), title: 'Liste à puces' },
    { icon: ListOrdered, action: () => insertText('1. ', '', 'élément numéroté'), title: 'Liste numérotée' },
    { icon: Quote, action: () => insertText('> ', '', 'citation'), title: 'Citation' },
    { icon: Code, action: () => insertText('`', '`', 'code'), title: 'Code inline' },
  ];

  const insertLink = () => {
    const url = prompt('Entrez l\'URL du lien:');
    if (url) {
      insertText('[', `](${url})`, 'texte du lien');
    }
  };

  const insertImage = () => {
    const url = prompt('Entrez l\'URL de l\'image:');
    if (url) {
      insertText('![', `](${url})`, 'description de l\'image');
    }
  };

  const insertCodeBlock = () => {
    insertText('```\n', '\n```', 'votre code ici');
  };

  const insertTable = () => {
    const table = `| Colonne 1 | Colonne 2 | Colonne 3 |
|-----------|-----------|-----------|
| Cellule 1 | Cellule 2 | Cellule 3 |
| Cellule 4 | Cellule 5 | Cellule 6 |`;
    insertAtCursor(table);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
        <div className="flex gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}
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
            onClick={insertCodeBlock}
            className="h-8 px-2 hover:bg-gray-200"
            title="Bloc de code"
          >
            <Code className="w-4 h-4 mr-1" />
            Code
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertTable}
            className="h-8 px-2 hover:bg-gray-200"
            title="Insérer un tableau"
          >
            Tableau
          </Button>
        </div>

        <div className="ml-auto">
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
      <div className="flex">
        {/* Markdown Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-300`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full p-4 outline-none resize-none ${
              isFocused ? 'bg-white' : 'bg-gray-50'
            }`}
            style={{ minHeight: height }}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 p-4 bg-white overflow-y-auto" style={{ minHeight: height }}>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value || '*Aucun contenu à prévisualiser*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
