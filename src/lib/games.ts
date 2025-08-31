import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Game, GamePlayer } from '@/types';

const GAMES_COLLECTION = 'games';

// Convert Firestore timestamp to Date
const convertTimestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Convert Date to Firestore timestamp
const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Transform game data for Firestore storage
const transformGameForFirestore = (game: Partial<Game>) => {
  const transformed: any = { ...game };
  
  if (game.date) {
    transformed.date = convertDateToTimestamp(game.date);
  }
  if (game.createdAt) {
    transformed.createdAt = convertDateToTimestamp(game.createdAt);
  }
  if (game.updatedAt) {
    transformed.updatedAt = convertDateToTimestamp(game.updatedAt);
  }
  
  // Transform player joinedAt dates
  if (game.players) {
    transformed.players = game.players.map(player => ({
      ...player,
      joinedAt: convertDateToTimestamp(player.joinedAt)
    }));
  }
  
  if (game.waitingList) {
    transformed.waitingList = game.waitingList.map(player => ({
      ...player,
      joinedAt: convertDateToTimestamp(player.joinedAt)
    }));
  }
  
  return transformed;
};

// Transform game data from Firestore
const transformGameFromFirestore = (doc: any): Game => {
  const data = doc.data();
  
  return {
    id: doc.id,
    ...data,
    date: convertTimestampToDate(data.date),
    createdAt: convertTimestampToDate(data.createdAt),
    updatedAt: convertTimestampToDate(data.updatedAt),
    players: data.players?.map((player: any) => ({
      ...player,
      joinedAt: convertTimestampToDate(player.joinedAt)
    })) || [],
    waitingList: data.waitingList?.map((player: any) => ({
      ...player,
      joinedAt: convertTimestampToDate(player.joinedAt)
    })) || [],
  };
};

// Create a new game
export const createGame = async (gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date();
    const gameWithTimestamps = {
      ...gameData,
      createdAt: now,
      updatedAt: now,
    };
    
    const transformedGame = transformGameForFirestore(gameWithTimestamps);
    const docRef = await addDoc(collection(db, GAMES_COLLECTION), transformedGame);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

// Get a single game by ID
export const getGame = async (gameId: string): Promise<Game | null> => {
  try {
    const gameDoc = await getDoc(doc(db, GAMES_COLLECTION, gameId));
    
    if (!gameDoc.exists()) {
      return null;
    }
    
    return transformGameFromFirestore(gameDoc);
  } catch (error) {
    console.error('Error getting game:', error);
    throw error;
  }
};

// Get all games with optional filtering
export const getGames = async (filters?: {
  status?: 'upcoming' | 'cancelled' | 'archived';
  createdBy?: string;
  limit?: number;
}): Promise<Game[]> => {
  try {
    let gameQuery = collection(db, GAMES_COLLECTION);
    
    // Build query with filters
    const constraints: any[] = [orderBy('date', 'asc')];
    
    if (filters?.status) {
      constraints.unshift(where('status', '==', filters.status));
    }
    
    if (filters?.createdBy) {
      constraints.unshift(where('createdBy', '==', filters.createdBy));
    }
    
    const q = query(gameQuery, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => transformGameFromFirestore(doc));
  } catch (error) {
    console.error('Error getting games:', error);
    throw error;
  }
};

// Subscribe to real-time games updates
export const subscribeToGames = (
  callback: (games: Game[]) => void,
  filters?: {
    status?: 'upcoming' | 'cancelled' | 'archived';
    createdBy?: string;
  }
) => {
  try {
    let gameQuery = collection(db, GAMES_COLLECTION);
    
    const constraints: any[] = [orderBy('date', 'asc')];
    
    if (filters?.status) {
      constraints.unshift(where('status', '==', filters.status));
    }
    
    if (filters?.createdBy) {
      constraints.unshift(where('createdBy', '==', filters.createdBy));
    }
    
    const q = query(gameQuery, ...constraints);
    
    return onSnapshot(
      q, 
      (snapshot) => {
        const games = snapshot.docs.map(doc => transformGameFromFirestore(doc));
        callback(games);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        // Call callback with empty array on error
        callback([]);
      }
    );
  } catch (error) {
    console.error('Error subscribing to games:', error);
    throw error;
  }
};

// Update a game
export const updateGame = async (gameId: string, updates: Partial<Game>): Promise<void> => {
  try {
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date(),
    };
    
    const transformedUpdates = transformGameForFirestore(updatesWithTimestamp);
    await updateDoc(doc(db, GAMES_COLLECTION, gameId), transformedUpdates);
  } catch (error) {
    console.error('Error updating game:', error);
    throw error;
  }
};

// Delete a game
export const deleteGame = async (gameId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, GAMES_COLLECTION, gameId));
  } catch (error) {
    console.error('Error deleting game:', error);
    throw error;
  }
};

// Register a player for a game
export const registerPlayerForGame = async (
  gameId: string, 
  player: GamePlayer,
  addToWaitingList = false
): Promise<void> => {
  try {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    const gameDoc = await getDoc(gameRef);
    
    if (!gameDoc.exists()) {
      throw new Error('Game not found');
    }
    
    const gameData = gameDoc.data() as Game & { players: (GamePlayer & { joinedAt: unknown })[]; waitingList: (GamePlayer & { joinedAt: unknown })[] };
    const currentPlayers = gameData.players?.length || 0;
    const maxPlayers = gameData.maxPlayers || 0;
    
    const playerWithTimestamp = {
      ...player,
      joinedAt: convertDateToTimestamp(player.joinedAt)
    };
    
    // Add to main players list if there's space, otherwise to waiting list
    if (!addToWaitingList && currentPlayers < maxPlayers) {
      await updateDoc(gameRef, {
        players: arrayUnion(playerWithTimestamp),
        updatedAt: convertDateToTimestamp(new Date())
      });
    } else {
      await updateDoc(gameRef, {
        waitingList: arrayUnion(playerWithTimestamp),
        updatedAt: convertDateToTimestamp(new Date())
      });
    }
  } catch (error) {
    console.error('Error registering player:', error);
    throw error;
  }
};

// Unregister a player from a game
export const unregisterPlayerFromGame = async (
  gameId: string, 
  userId: string
): Promise<void> => {
  try {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    const gameDoc = await getDoc(gameRef);
    
    if (!gameDoc.exists()) {
      throw new Error('Game not found');
    }
    
    const gameData = gameDoc.data() as Game & { players: (GamePlayer & { joinedAt: unknown })[]; waitingList: (GamePlayer & { joinedAt: unknown })[] };
    const players = gameData.players || [];
    const waitingList = gameData.waitingList || [];
    
    // Find and remove player from either list
    const playerInMain = players.find((p) => p.userId === userId);
    const playerInWaiting = waitingList.find((p) => p.userId === userId);
    
    if (playerInMain) {
      await updateDoc(gameRef, {
        players: arrayRemove(playerInMain),
        updatedAt: convertDateToTimestamp(new Date())
      });
      
      // Move first player from waiting list to main list if there's space
      if (waitingList.length > 0) {
        const firstWaitingPlayer = waitingList[0];
        await updateDoc(gameRef, {
          waitingList: arrayRemove(firstWaitingPlayer),
          players: arrayUnion(firstWaitingPlayer),
          updatedAt: convertDateToTimestamp(new Date())
        });
      }
    } else if (playerInWaiting) {
      await updateDoc(gameRef, {
        waitingList: arrayRemove(playerInWaiting),
        updatedAt: convertDateToTimestamp(new Date())
      });
    } else {
      throw new Error('Player not found in game');
    }
  } catch (error) {
    console.error('Error unregistering player:', error);
    throw error;
  }
};

// Update player payment status
export const updatePlayerPaymentStatus = async (
  gameId: string,
  userId: string,
  hasPaid: boolean
): Promise<void> => {
  try {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    const gameDoc = await getDoc(gameRef);
    
    if (!gameDoc.exists()) {
      throw new Error('Game not found');
    }
    
    const gameData = gameDoc.data() as Game & { players: (GamePlayer & { joinedAt: unknown })[]; waitingList: (GamePlayer & { joinedAt: unknown })[] };
    const players = [...(gameData.players || [])];
    const waitingList = [...(gameData.waitingList || [])];
    
    // Update player in main list
    const playerIndex = players.findIndex(p => p.userId === userId);
    if (playerIndex !== -1) {
      players[playerIndex] = { ...players[playerIndex], hasPaid };
      await updateDoc(gameRef, {
        players: players.map(p => ({
          ...p,
          joinedAt: p.joinedAt instanceof Timestamp ? p.joinedAt : convertDateToTimestamp(p.joinedAt)
        })),
        updatedAt: convertDateToTimestamp(new Date())
      });
      return;
    }
    
    // Update player in waiting list
    const waitingIndex = waitingList.findIndex(p => p.userId === userId);
    if (waitingIndex !== -1) {
      waitingList[waitingIndex] = { ...waitingList[waitingIndex], hasPaid };
      await updateDoc(gameRef, {
        waitingList: waitingList.map(p => ({
          ...p,
          joinedAt: p.joinedAt instanceof Timestamp ? p.joinedAt : convertDateToTimestamp(p.joinedAt)
        })),
        updatedAt: convertDateToTimestamp(new Date())
      });
      return;
    }
    
    throw new Error('Player not found in game');
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Get upcoming games for a specific user
export const getUserUpcomingGames = async (userId: string): Promise<Game[]> => {
  try {
    const games = await getGames({ status: 'upcoming' });
    
    return games.filter(game => 
      game.players.some(player => player.userId === userId) ||
      game.waitingList.some(player => player.userId === userId)
    );
  } catch (error) {
    console.error('Error getting user upcoming games:', error);
    throw error;
  }
};