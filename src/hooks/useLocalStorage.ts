import { useEffect } from 'react';
import { StorageService } from '../services/storage';
import type { SavedConfig } from '../types';

/**
 * Hook para gerenciar persistência de configurações
 */
export const useConfigPersistence = (config: SavedConfig) => {
  useEffect(() => {
    StorageService.saveConfig(config);
  }, [config]);
};

/**
 * Hook para carregar configurações iniciais
 */
export const useInitialConfig = () => {
  return StorageService.loadConfig();
};