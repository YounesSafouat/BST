import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
  className?: string;
}

export default function VideoUpload({
  value,
  onChange,
  label = 'Vidéo',
  placeholder = 'URL de la vidéo (YouTube, Vimeo) ou télécharger',
  showPreview = true,
  className = '',
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const inputId = `video-upload-${Math.random().toString(36).substring(7)}`;

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
          description: "Vidéo téléchargée avec succès",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du téléchargement de la vidéo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getVideoEmbedUrl = (url: string): string => {
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.includes('youtube.com/watch')
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
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
          accept="video/*"
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
          {value.startsWith('data:') || value.startsWith('blob:') || value.includes('.mp4') || value.includes('.webm') || value.includes('.mov') ? (
            <video
              src={value}
              controls
              className="w-full max-w-md rounded-lg border"
              style={{ maxHeight: '300px' }}
            />
          ) : value.includes('youtube') || value.includes('youtu.be') || value.includes('vimeo') ? (
            <div className="w-full max-w-md aspect-video rounded-lg border overflow-hidden">
              <iframe
                src={getVideoEmbedUrl(value)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

