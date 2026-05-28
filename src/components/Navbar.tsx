import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, PlusSquare, MessageSquare, User as UserIcon, LogOut } from 'lucide-react';
import { storage } from '../utils/storage';
import './Navbar.css';

interface NavbarProps {
  navigate: (page: any) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ navigate, currentPage }) => {
  const { user, logout } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkUnread = () => {
      const allChats = storage.getChats();
      const userChats = allChats.filter(c => c.buyerId === user.id || c.sellerId === user.id);
      const unread = userChats.some(chat => {
        const lastRead = chat.lastRead?.[user.id] || 0;
        return chat.messages.some(m => m.senderId !== user.id && m.timestamp > lastRead);
      });
      setHasUnread(unread);
    };

    checkUnread();
    const interval = setInterval(checkUnread, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [user]);

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('home')}>
        <span className="logo-text">BOOKO</span>
      </div>
      
      <div className="nav-links">
        <button 
          className={currentPage === 'home' ? 'active' : ''} 
          onClick={() => navigate('home')}
        >
          <Home size={20} />
          <span>Explore</span>
        </button>
        <button 
          className={currentPage === 'post-ad' ? 'active' : ''} 
          onClick={() => navigate('post-ad')}
        >
          <PlusSquare size={20} />
          <span>Sell</span>
        </button>
        <button 
          className={`chat-nav-link ${currentPage === 'chat' ? 'active' : ''}`}
          onClick={() => navigate('chat')}
        >
          <div className="icon-container">
            <MessageSquare size={20} />
            {hasUnread && <div className="unread-dot"></div>}
          </div>
          <span>Chats</span>
        </button>
      </div>

      <div className="nav-auth">
        {user ? (
          <div className="user-info">
            <button 
              className={`profile-btn ${currentPage === 'profile' ? 'active' : ''}`}
              onClick={() => navigate('profile')}
            >
              <UserIcon size={20} />
              <span>{user.username}</span>
            </button>
            <button className="logout-btn" onClick={logout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate('login')}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
