/**
 * Base service class with common patterns for TanStack Query integration
 */
export abstract class BaseService {
  protected static readonly STALE_TIME = {
    SHORT: 30 * 1000,      // 30 seconds
    MEDIUM: 5 * 60 * 1000, // 5 minutes  
    LONG: 30 * 60 * 1000,  // 30 minutes
  };

  protected static readonly CACHE_TIME = {
    SHORT: 1 * 60 * 1000,  // 1 minute
    MEDIUM: 5 * 60 * 1000, // 5 minutes
    LONG: 30 * 60 * 1000,  // 30 minutes
  };

  /**
   * Generate consistent query keys
   */
  protected static createQueryKey(resource: string, params?: Record<string, any>): (string | Record<string, any>)[] {
    const key = [resource];
    if (params && Object.keys(params).length > 0) {
      key.push(params);
    }
    return key;
  }

  /**
   * Common error handler for service methods
   */
  protected static handleServiceError(error: unknown, context: string): never {
    console.error(`❌ ${context}:`, error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(`Unknown error in ${context}`);
  }
}

/**
 * Query configurations for different data types
 */
export const QueryConfig = {
  // Real-time data (games, registrations)
  REALTIME: {
    staleTime: BaseService['STALE_TIME'].SHORT,
    gcTime: BaseService['CACHE_TIME'].MEDIUM,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },
  
  // Static data (user profiles, settings)
  STATIC: {
    staleTime: BaseService['STALE_TIME'].LONG,
    gcTime: BaseService['CACHE_TIME'].LONG,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
  
  // Frequently changing data (notifications, activity)
  DYNAMIC: {
    staleTime: BaseService['STALE_TIME'].SHORT,
    gcTime: BaseService['CACHE_TIME'].SHORT,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 60 * 1000, // 1 minute
  },
} as const;