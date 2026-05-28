export type Genre = 'Fiction' | 'Non-Fiction' | 'Sci-Fi' | 'Fantasy' | 'Mystery' | 'Biography' | 'History' | 'Romance' | 'Horror';

export interface User {
  id: string;
  username: string;
  password?: string; // Only for local storage logic, shouldn't be passed around unnecessarily
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  genre: Genre;
  price: number;
  image: string; // Base64 string
  createdAt: number;
}

export interface Message {
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  listingTitle: string;
  messages: Message[];
  lastRead: {
    [userId: string]: number;
  };
}

export const GENRES: Genre[] = [
  'Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Mystery', 'Biography', 'History', 'Romance', 'Horror'
];
