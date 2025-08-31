import { Game } from '@/types';

// Mock games for development and testing
export const createMockGames = (): Game[] => {
  const now = new Date();
  
  return [
    {
      id: 'mock-game-1',
      title: 'Thursday Evening Volleyball',
      date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      location: {
        name: 'Beach Volleyball Center Amsterdam',
        address: 'Zuidpark 20, 1082 MS Amsterdam',
        googleMapsUrl: 'https://maps.google.com/?q=Beach+Volleyball+Center+Amsterdam',
      },
      maxPlayers: 12,
      price: 5,
      tikkieUrl: 'https://tikkie.me/pay/mock-payment-1',
      players: [
        {
          userId: 'mock-user-1',
          userName: 'Alex Johnson',
          userEmail: 'alex@example.com',
          joinedAt: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
          hasPaid: true,
          willBringBall: true,
          willBringSpeaker: false,
        },
        {
          userId: 'mock-user-2',
          userName: 'Sara Mitchell',
          userEmail: 'sara@example.com',
          joinedAt: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
          hasPaid: true,
          willBringBall: false,
          willBringSpeaker: true,
        },
        {
          userId: 'mock-user-3',
          userName: 'Mike Chen',
          userEmail: 'mike@example.com',
          joinedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
          hasPaid: false,
          willBringBall: false,
          willBringSpeaker: false,
        },
        {
          userId: 'mock-user-4',
          userName: 'Emma Williams',
          userEmail: 'emma@example.com',
          joinedAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
          hasPaid: true,
          willBringBall: false,
          willBringSpeaker: false,
        },
      ],
      waitingList: [
        {
          userId: 'mock-user-5',
          userName: 'David Brown',
          userEmail: 'david@example.com',
          joinedAt: new Date(now.getTime() - 10 * 60 * 1000), // 10 minutes ago
          hasPaid: false,
          willBringBall: true,
          willBringSpeaker: false,
        },
      ],
      status: 'upcoming',
      createdBy: 'mock-admin-1',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      updatedAt: new Date(now.getTime() - 15 * 60 * 1000),
      needsBall: true,
      needsSpeaker: true,
      calendarEventId: 'mock-calendar-1',
    },
    {
      id: 'mock-game-2',
      title: 'Weekend Beach Tournament',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      location: {
        name: 'Beach Club O2',
        address: 'Strandweg 1, 2586 JK Den Haag',
        googleMapsUrl: 'https://maps.google.com/?q=Beach+Club+O2+Den+Haag',
      },
      maxPlayers: 16,
      price: 8,
      players: [
        {
          userId: 'mock-user-6',
          userName: 'Lisa Rodriguez',
          userEmail: 'lisa@example.com',
          joinedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          hasPaid: true,
          willBringBall: false,
          willBringSpeaker: true,
        },
        {
          userId: 'mock-user-7',
          userName: 'Tom Anderson',
          userEmail: 'tom@example.com',
          joinedAt: new Date(now.getTime() - 90 * 60 * 1000), // 1.5 hours ago
          hasPaid: false,
          willBringBall: true,
          willBringSpeaker: false,
        },
      ],
      waitingList: [],
      status: 'upcoming',
      createdBy: 'mock-admin-1',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(now.getTime() - 90 * 60 * 1000),
      needsBall: true,
      needsSpeaker: true,
    },
    {
      id: 'mock-game-3',
      title: 'Monday Morning Volleyball',
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      location: {
        name: 'Sportpark De Toekomst',
        address: 'De Toekomst 1, 1000 AA Amsterdam',
        googleMapsUrl: 'https://maps.google.com/?q=Sportpark+De+Toekomst+Amsterdam',
      },
      maxPlayers: 8,
      price: 6,
      players: [],
      waitingList: [],
      status: 'upcoming',
      createdBy: 'mock-admin-1',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      needsBall: true,
      needsSpeaker: false,
    },
    {
      id: 'mock-game-4',
      title: 'Friday Night Lights Volleyball',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      location: {
        name: 'Beach Volleyball Club Utrecht',
        address: 'Wilhelminapark 65, 3581 NP Utrecht',
        googleMapsUrl: 'https://maps.google.com/?q=Beach+Volleyball+Club+Utrecht',
      },
      maxPlayers: 14,
      price: 7,
      players: [
        {
          userId: 'mock-user-8',
          userName: 'Kevin Zhang',
          userEmail: 'kevin@example.com',
          joinedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
          hasPaid: true,
          willBringBall: true,
          willBringSpeaker: true,
        },
        {
          userId: 'mock-user-9',
          userName: 'Sophie Taylor',
          userEmail: 'sophie@example.com',
          joinedAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
          hasPaid: true,
          willBringBall: false,
          willBringSpeaker: false,
        },
        {
          userId: 'mock-user-10',
          userName: 'Marcus Johnson',
          userEmail: 'marcus@example.com',
          joinedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          hasPaid: false,
          willBringBall: false,
          willBringSpeaker: false,
        },
      ],
      waitingList: [],
      status: 'upcoming',
      createdBy: 'mock-admin-1',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      needsBall: false, // Kevin is bringing it
      needsSpeaker: false, // Kevin is bringing it
    },
  ];
};

// Helper to create mock games via console in development
export const addMockGamesToFirestore = async () => {
  if (typeof window === 'undefined') {
    console.warn('Mock games can only be added in browser environment');
    return;
  }

  try {
    const { createGame } = await import('./games');
    const mockGames = createMockGames();
    
    console.log('🎮 Adding mock games to Firestore...');
    
    for (const mockGame of mockGames) {
      try {
        // Remove the id and timestamps for creation
        const { id, createdAt, updatedAt, ...gameData } = mockGame;
        await createGame(gameData);
        console.log(`✅ Added mock game: ${mockGame.title}`);
      } catch (error) {
        console.error(`❌ Failed to add mock game: ${mockGame.title}`, error);
        throw error;
      }
    }
    
    console.log('🎉 Mock games setup complete!');
  } catch (error) {
    console.error('❌ Error in addMockGamesToFirestore:', error);
    throw error;
  }
};

// Helper to get mock user games for a specific user
export const getMockUserGames = (userId: string): Game[] => {
  const allGames = createMockGames();
  return allGames.filter(game => 
    game.players.some(player => player.userId === userId) ||
    game.waitingList.some(player => player.userId === userId)
  );
};