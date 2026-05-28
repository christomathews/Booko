import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import PostAd from './pages/PostAd';
import ChatHub from './pages/ChatHub';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import './App.css';

type Page = 'home' | 'post-ad' | 'chat' | 'login' | 'profile';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = (page: Page) => {
    if (!user && (page === 'post-ad' || page === 'chat' || page === 'profile')) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    if (!user && currentPage !== 'home' && currentPage !== 'login') {
      return <Login onLogin={() => setCurrentPage('home')} />;
    }

    switch (currentPage) {
      case 'home': return <Home navigate={navigate} />;
      case 'post-ad': return <PostAd navigate={navigate} />;
      case 'chat': return <ChatHub />;
      case 'profile': return <Profile navigate={navigate} />;
      case 'login': return <Login onLogin={() => setCurrentPage('home')} />;
      default: return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar navigate={navigate} currentPage={currentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
