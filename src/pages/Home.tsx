import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, MessageCircle } from 'lucide-react';
import { GENRES } from '../types';
import type { Listing, Genre } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import './Home.css';

interface HomeProps {
  navigate: (page: any) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc'>('none');

  useEffect(() => {
    setListings(storage.getListings());
  }, []);

  const filteredListings = listings
    .filter(l => !user || l.sellerId !== user.id) // Hide user's own listings
    .filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(l => selectedGenre === 'All' || l.genre === selectedGenre)
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      return 0;
    });

  const handleMessageSeller = (listing: Listing) => {
    if (!user) {
      navigate('login');
      return;
    }

    const chats = storage.getChats();
    let chat = chats.find(c => c.buyerId === user.id && c.listingId === listing.id);

    if (!chat) {
      chat = {
        id: Math.random().toString(36).substr(2, 9),
        buyerId: user.id,
        sellerId: listing.sellerId,
        listingId: listing.id,
        listingTitle: listing.title,
        messages: [],
        lastRead: {
          [user.id]: Date.now(),
          [listing.sellerId]: 0
        }
      };
      storage.setChats([...chats, chat]);
    }

    navigate('chat');
  };

  return (
    <div className="home-container">
      <header className="hero">
        <h1>Your Next Favorite Book <span className="highlight">Awaits.</span></h1>
        <p>Join the community of book lovers buying and selling across India.</p>
      </header>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search titles, authors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="select-wrapper">
            <Filter size={18} className="select-icon" />
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value as any)}
            >
              <option value="All">All Genres</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <button 
            className={`sort-btn ${sortOrder === 'asc' ? 'active' : ''}`}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')}
          >
            <ArrowUpDown size={18} />
            <span>{sortOrder === 'asc' ? 'Price: Low to High' : 'Sort by Price'}</span>
          </button>
        </div>
      </div>

      <div className="listings-grid">
        {filteredListings.length > 0 ? (
          filteredListings.map(listing => (
            <div key={listing.id} className="book-card">
              <div className="card-image">
                <img src={listing.image} alt={listing.title} />
                <span className="genre-tag">{listing.genre}</span>
              </div>
              <div className="card-content">
                <h3>{listing.title}</h3>
                <p className="seller">Posted by {listing.sellerName}</p>
                <p className="description">{listing.description}</p>
                <div className="card-footer">
                  <span className="price">₹{listing.price}</span>
                  <button 
                    className="message-btn"
                    onClick={() => handleMessageSeller(listing)}
                  >
                    <MessageCircle size={18} />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No books found. Try a different search or filter!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
