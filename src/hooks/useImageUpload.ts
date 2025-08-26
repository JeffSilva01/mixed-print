import { useState, useCallback } from 'react';
import { fileToDataURL, isValidImageFile } from '../utils/helpers';

/**
 * Hook para gerenciar upload de imagens
 */
export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (
    file: File,
    onSuccess: (file: File, dataUrl: string) => void
  ) => {
    setIsUploading(true);
    setError(null);

    try {
      // Validar arquivo
      if (!isValidImageFile(file)) {
        throw new Error('Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WebP.');
      }

      // Validar tamanho (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. O tamanho máximo é 10MB.');
      }

      // Converter para Data URL
      const dataUrl = await fileToDataURL(file);
      
      onSuccess(file, dataUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload da imagem';
      setError(errorMessage);
      console.error('Erro no upload:', err);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUploading,
    error,
    uploadImage,
    clearError,
  };
};