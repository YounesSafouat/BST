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

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    updateContent();
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
    { icon: Bold, command: 'bold', title: 'Gras' },
    { icon: Italic, command: 'italic', title: 'Italique' },
    { icon: Heading1, command: 'formatBlock', value: '<h1>', title: 'Titre 1' },
    { icon: Heading2, command: 'formatBlock', value: '<h2>', title: 'Titre 2' },
    { icon: Heading3, command: 'formatBlock', value: '<h3>', title: 'Titre 3' },
    { icon: List, command: 'insertUnorderedList', title: 'Liste à puces' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Liste numérotée' },
    { icon: Quote, command: 'formatBlock', value: '<blockquote>', title: 'Citation' },
    { icon: Code, command: 'formatBlock', value: '<pre>', title: 'Code' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Aligner à gauche' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Centrer' },
    { icon: AlignRight, command: 'justifyRight', title: 'Aligner à droite' },
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
              onClick={() => execCommand(button.command, button.value)}
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
          <div
            ref={editorRef}
            contentEditable
            onInput={updateContent}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPaste={handlePaste}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                document.execCommand('insertParagraph', false);
                updateContent();
              }
            }}
            className={`w-full p-4 outline-none resize-none ${
              isFocused ? 'bg-white' : 'bg-gray-50'
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
