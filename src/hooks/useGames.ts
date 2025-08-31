import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Game, GamePlayer } from '@/types';
import { GamesService } from '@/services/games.service';
import { QueryConfig } from '@/services/base.service';

// Types for hook options
type GamesFilters = {
  status?: 'upcoming' | 'cancelled' | 'archived';
  createdBy?: string;
  limit?: number;
};

/**
 * Fetch all games with optional filters
 */
export const useGames = (
  filters?: GamesFilters,
  options?: Partial<UseQueryOptions<Game[], Error>>
) => {
  return useQuery({
    queryKey: GamesService.getGamesQueryKey(filters),
    queryFn: () => GamesService.fetchGames(filters),
    ...QueryConfig.REALTIME,
    ...options,
  });
};

/**
 * Real-time games subscription using TanStack Query
 * Combines Firestore real-time updates with TanStack Query caching
 */
export const useRealtimeGames = (
  filters?: Pick<GamesFilters, 'status' | 'createdBy'>,
  options?: Partial<UseQueryOptions<Game[], Error>>
) => {
  const queryClient = useQueryClient();
  const queryKey = GamesService.getGamesQueryKey(filters);

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = GamesService.subscribeToGames(
      (games) => {
        queryClient.setQueryData(queryKey, games);
      },
      filters
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient, JSON.stringify(filters), JSON.stringify(queryKey)]);

  return useQuery({
    queryKey,
    queryFn: () => GamesService.fetchGames(filters),
    staleTime: Infinity, // Real-time data is never stale
    gcTime: QueryConfig.REALTIME.gcTime,
    ...options,
  });
};

/**
 * Fetch single game by ID
 */
export const useGame = (
  gameId: string,
  options?: Partial<UseQueryOptions<Game | null, Error>>
) => {
  return useQuery({
    queryKey: GamesService.getGameQueryKey(gameId),
    queryFn: () => GamesService.fetchGame(gameId),
    ...QueryConfig.REALTIME,
    enabled: !!gameId, // Only run query if gameId exists
    ...options,
  });
};

/**
 * Fetch user's games
 */
export const useUserGames = (
  userId: string,
  options?: Partial<UseQueryOptions<Game[], Error>>
) => {
  return useQuery({
    queryKey: GamesService.getUserGamesQueryKey(userId),
    queryFn: () => GamesService.fetchUserGames(userId),
    ...QueryConfig.REALTIME,
    enabled: !!userId, // Only run query if userId exists
    ...options,
  });
};

/**
 * Create new game mutation
 */
export const useCreateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameData: Parameters<typeof GamesService.createGame>[0]) => 
      GamesService.createGame(gameData),
    onSuccess: () => {
      // Invalidate all games queries to refresh the data
      queryClient.invalidateQueries({ 
        queryKey: [GamesService.QUERY_KEYS.GAMES] 
      });
    },
    onError: (error) => {
      console.error('❌ Create game error:', error);
    },
  });
};

/**
 * Update game mutation
 */
export const useUpdateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      gameId, 
      gameData 
    }: { 
      gameId: string; 
      gameData: Parameters<typeof GamesService.updateGame>[1];
    }) => GamesService.updateGame(gameId, gameData),
    onSuccess: (_, { gameId }) => {
      // Invalidate specific game and all games queries
      queryClient.invalidateQueries({ 
        queryKey: GamesService.getGameQueryKey(gameId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: [GamesService.QUERY_KEYS.GAMES] 
      });
    },
    onError: (error) => {
      console.error('❌ Update game error:', error);
    },
  });
};

/**
 * Delete game mutation
 */
export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameId: string) => GamesService.deleteGame(gameId),
    onSuccess: (_, gameId) => {
      // Remove game from cache and invalidate games list
      queryClient.removeQueries({ 
        queryKey: GamesService.getGameQueryKey(gameId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: [GamesService.QUERY_KEYS.GAMES] 
      });
    },
    onError: (error) => {
      console.error('❌ Delete game error:', error);
    },
  });
};

/**
 * Register player for game mutation with optimistic updates
 */
export const useRegisterForGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, player }: { gameId: string; player: GamePlayer }) => 
      GamesService.registerPlayer(gameId, player),
    
    // Optimistic update
    onMutate: async ({ gameId, player }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: GamesService.getGameQueryKey(gameId) });
      
      // Snapshot previous value
      const previousGame = queryClient.getQueryData<Game>(GamesService.getGameQueryKey(gameId));
      
      // Optimistically update the game
      if (previousGame) {
        const updatedGame: Game = {
          ...previousGame,
          players: [...previousGame.players, player],
        };
        queryClient.setQueryData(GamesService.getGameQueryKey(gameId), updatedGame);
      }
      
      return { previousGame };
    },
    
    onError: (error, { gameId }, context) => {
      // Revert optimistic update on error
      if (context?.previousGame) {
        queryClient.setQueryData(GamesService.getGameQueryKey(gameId), context.previousGame);
      }
      console.error('❌ Register for game error:', error);
    },
    
    onSuccess: (_, { gameId, player }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [GamesService.QUERY_KEYS.GAMES] });
      queryClient.invalidateQueries({ 
        queryKey: GamesService.getUserGamesQueryKey(player.userId) 
      });
    },
  });
};

/**
 * Unregister player from game mutation
 */
export const useUnregisterFromGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, userId }: { gameId: string; userId: string }) => 
      GamesService.unregisterPlayer(gameId, userId),
    
    onSuccess: (_, { gameId, userId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: GamesService.getGameQueryKey(gameId) });
      queryClient.invalidateQueries({ queryKey: [GamesService.QUERY_KEYS.GAMES] });
      queryClient.invalidateQueries({ 
        queryKey: GamesService.getUserGamesQueryKey(userId) 
      });
    },
    
    onError: (error) => {
      console.error('❌ Unregister from game error:', error);
    },
  });
};

/**
 * Update player payment status mutation
 */
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      gameId, 
      userId, 
      hasPaid 
    }: { 
      gameId: string; 
      userId: string; 
      hasPaid: boolean;
    }) => GamesService.updatePaymentStatus(gameId, userId, hasPaid),
    
    onSuccess: (_, { gameId, userId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: GamesService.getGameQueryKey(gameId) });
      queryClient.invalidateQueries({ queryKey: [GamesService.QUERY_KEYS.GAMES] });
      queryClient.invalidateQueries({ 
        queryKey: GamesService.getUserGamesQueryKey(userId) 
      });
    },
    
    onError: (error) => {
      console.error('❌ Update payment status error:', error);
    },
  });
};