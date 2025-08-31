import { Game, GamePlayer } from '@/types';
import { BaseService } from './base.service';
import {
  getGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
  registerPlayerForGame,
  unregisterPlayerFromGame,
  updatePlayerPaymentStatus,
  subscribeToGames,
  getUserUpcomingGames,
} from '@/lib/games';

/**
 * Games service with TanStack Query integration
 * Provides a clean abstraction over Firebase operations
 */
export class GamesService extends BaseService {
  // Query Keys
  static readonly QUERY_KEYS = {
    GAMES: 'games',
    GAME: 'game',
    USER_GAMES: 'userGames',
  } as const;

  /**
   * Fetch all games with optional filters
   */
  static async fetchGames(filters?: { 
    status?: 'upcoming' | 'cancelled' | 'archived';
    createdBy?: string;
    limit?: number;
  }): Promise<Game[]> {
    try {
      return await getGames(filters);
    } catch (error) {
      this.handleServiceError(error, 'fetchGames');
    }
  }

  /**
   * Fetch single game by ID
   */
  static async fetchGame(gameId: string): Promise<Game | null> {
    try {
      return await getGame(gameId);
    } catch (error) {
      this.handleServiceError(error, 'fetchGame');
    }
  }

  /**
   * Fetch user's games
   */
  static async fetchUserGames(userId: string): Promise<Game[]> {
    try {
      return await getUserUpcomingGames(userId);
    } catch (error) {
      this.handleServiceError(error, 'fetchUserGames');
    }
  }

  /**
   * Create new game
   */
  static async createGame(gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      return await createGame(gameData);
    } catch (error) {
      this.handleServiceError(error, 'createGame');
    }
  }

  /**
   * Update existing game
   */
  static async updateGame(
    gameId: string, 
    gameData: Partial<Omit<Game, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      return await updateGame(gameId, gameData);
    } catch (error) {
      this.handleServiceError(error, 'updateGame');
    }
  }

  /**
   * Delete game
   */
  static async deleteGame(gameId: string): Promise<void> {
    try {
      return await deleteGame(gameId);
    } catch (error) {
      this.handleServiceError(error, 'deleteGame');
    }
  }

  /**
   * Register player for game
   */
  static async registerPlayer(gameId: string, player: GamePlayer): Promise<void> {
    try {
      return await registerPlayerForGame(gameId, player);
    } catch (error) {
      this.handleServiceError(error, 'registerPlayer');
    }
  }

  /**
   * Unregister player from game
   */
  static async unregisterPlayer(gameId: string, userId: string): Promise<void> {
    try {
      return await unregisterPlayerFromGame(gameId, userId);
    } catch (error) {
      this.handleServiceError(error, 'unregisterPlayer');
    }
  }

  /**
   * Update player payment status
   */
  static async updatePaymentStatus(gameId: string, userId: string, hasPaid: boolean): Promise<void> {
    try {
      return await updatePlayerPaymentStatus(gameId, userId, hasPaid);
    } catch (error) {
      this.handleServiceError(error, 'updatePaymentStatus');
    }
  }

  /**
   * Set up real-time subscription for games
   * Returns unsubscribe function
   */
  static subscribeToGames(
    callback: (games: Game[]) => void,
    filters?: { status?: 'upcoming' | 'cancelled' | 'archived'; createdBy?: string }
  ): () => void {
    try {
      return subscribeToGames(callback, filters);
    } catch (error) {
      this.handleServiceError(error, 'subscribeToGames');
    }
  }

  // Query key generators
  static getGamesQueryKey(filters?: Record<string, any>) {
    return this.createQueryKey(this.QUERY_KEYS.GAMES, filters);
  }

  static getGameQueryKey(gameId: string) {
    return this.createQueryKey(this.QUERY_KEYS.GAME, { id: gameId });
  }

  static getUserGamesQueryKey(userId: string) {
    return this.createQueryKey(this.QUERY_KEYS.USER_GAMES, { userId });
  }
}