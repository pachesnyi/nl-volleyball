export type UserRole = 'admin' | 'user' | 'guest' | 'cherry';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  photoURL?: string;
  createdAt: Date;
  approvedAt?: Date;
}

export interface Game {
  id: string;
  title: string;
  date: Date;
  location: {
    name: string;
    address: string;
    googleMapsUrl: string;
    coordinates?: { lat: number; lng: number; };
  };
  maxPlayers: number;
  price: number;
  tikkieUrl?: string;
  players: GamePlayer[];
  waitingList: GamePlayer[];
  status: 'upcoming' | 'cancelled' | 'archived';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  needsBall: boolean;
  needsSpeaker: boolean;
  calendarEventId?: string;
}

export interface GamePlayer {
  userId: string;
  userName: string;
  userEmail: string;
  joinedAt: Date;
  hasPaid: boolean;
  willBringBall: boolean;
  willBringSpeaker: boolean;
}