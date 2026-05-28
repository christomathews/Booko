import type { User, Listing, Chat } from '../types';

const KEYS = {
  USERS: 'booko_users',
  LISTINGS: 'booko_listings',
  CHATS: 'booko_chats',
  CURRENT_USER: 'booko_current_user'
};

export const storage = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  setUsers: (users: User[]) => localStorage.setItem(KEYS.USERS, JSON.stringify(users)),
  
  getListings: (): Listing[] => JSON.parse(localStorage.getItem(KEYS.LISTINGS) || '[]'),
  setListings: (listings: Listing[]) => localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings)),
  
  updateListing: (updated: Listing) => {
    const listings = storage.getListings();
    const newListings = listings.map(l => l.id === updated.id ? updated : l);
    storage.setListings(newListings);
  },

  deleteListing: (id: string) => {
    const listings = storage.getListings();
    storage.setListings(listings.filter(l => l.id !== id));
  },
  
  getChats: (): Chat[] => JSON.parse(localStorage.getItem(KEYS.CHATS) || '[]'),
  setChats: (chats: Chat[]) => localStorage.setItem(KEYS.CHATS, JSON.stringify(chats)),
  
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.CURRENT_USER);
  }
};
