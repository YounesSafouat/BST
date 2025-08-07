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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const insertLink = () => {
    const url = prompt('Entrez l\'URL du lien:');
    if (url) {
      insertText('<a href="' + url + '" target="_blank">', '</a>', 'texte du lien');
    }
  };

  const insertImage = () => {
    const url = prompt('Entrez l\'URL de l\'image:');
    if (url) {
      insertAtCursor(`<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`);
    }
  };

  const insertDiv = () => {
    const div = `<div style="display: flex; align-items: center; margin: 2rem 0;">
  <img src="URL_DE_L_IMAGE" alt="Description" style="width: 500px; margin-right: 5rem; border-radius: 8px;">
  <div>
    <p>Votre texte ici...</p>
  </div>
</div>`;
    insertAtCursor(div);
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
    { icon: Bold, action: () => insertText('<strong>', '</strong>', 'texte en gras'), title: 'Gras' },
    { icon: Italic, action: () => insertText('<em>', '</em>', 'texte en italique'), title: 'Italique' },
    { icon: Heading1, action: () => insertText('<h1>', '</h1>', 'Titre 1'), title: 'Titre 1' },
    { icon: Heading2, action: () => insertText('<h2>', '</h2>', 'Titre 2'), title: 'Titre 2' },
    { icon: Heading3, action: () => insertText('<h3>', '</h3>', 'Titre 3'), title: 'Titre 3' },
    { icon: List, action: () => insertText('<ul>\n  <li>', '</li>\n</ul>', 'élément de liste'), title: 'Liste à puces' },
    { icon: ListOrdered, action: () => insertText('<ol>\n  <li>', '</li>\n</ol>', 'élément numéroté'), title: 'Liste numérotée' },
    { icon: Quote, action: () => insertText('<blockquote>', '</blockquote>', 'citation'), title: 'Citation' },
    { icon: Code, action: () => insertText('<code>', '</code>', 'code'), title: 'Code inline' },
  ];

  return (
    <div className={editorContainerClass}>
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
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full p-4 outline-none resize-none font-mono text-sm ${
              isFocused ? 'bg-white' : 'bg-gray-50'
            }`}
            style={{ height: '100%' }}
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
