import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  placeholder = 'URL de l\'image ou télécharger',
  showPreview = true,
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const inputId = `image-upload-${Math.random().toString(36).substring(7)}`;

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        onChange(data.url);
        toast({
          title: "Succès",
          description: "Image téléchargée avec succès",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du téléchargement de l'image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2 mt-2">
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          disabled={isUploading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(file);
            }
          }}
          className="hidden"
          id={inputId}
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(inputId)?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Téléchargement...' : 'Télécharger'}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange('')}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {showPreview && value && (
        <div className="mt-2">
          <img
            src={value}
            alt="Aperçu"
            className="w-32 h-32 object-cover rounded-lg border"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

