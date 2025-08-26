import type { SavedConfig } from '../types';
import { STORAGE_KEY } from '../constants';

/**
 * Serviço para gerenciar o localStorage
 */
export class StorageService {
  /**
   * Salva configurações no localStorage
   */
  static saveConfig(config: SavedConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn('Erro ao salvar configurações:', error);
    }
  }

  /**
   * Carrega configurações do localStorage
   */
  static loadConfig(): Partial<SavedConfig> | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Erro ao carregar configurações:', error);
      return null;
    }
  }

  /**
   * Remove configurações do localStorage
   */
  static clearConfig(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Erro ao limpar configurações:', error);
    }
  }

  /**
   * Verifica se há configurações salvas
   */
  static hasConfig(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
}