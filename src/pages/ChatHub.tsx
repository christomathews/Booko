import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, User, Book } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import type { Chat, Message } from '../types';
import './ChatHub.css';

const ChatHub: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const allChats = storage.getChats();
    const userChats = allChats.filter(c => c.buyerId === user.id || c.sellerId === user.id);
    setChats(userChats);
  }, [user]);

  // Mark chat as read when it becomes active
  useEffect(() => {
    if (activeChat && user) {
      const allChats = storage.getChats();
      const updatedAllChats = allChats.map(c => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            lastRead: {
              ...(c.lastRead || {}),
              [user.id]: Date.now()
            }
          };
        }
        return c;
      });
      storage.setChats(updatedAllChats);
    }
  }, [activeChat?.id, user?.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeChat || !newMessage.trim()) return;

    const timestamp = Date.now();
    const message: Message = {
      senderId: user.id,
      text: newMessage,
      timestamp
    };

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, message],
      lastRead: {
        ...(activeChat.lastRead || {}),
        [user.id]: timestamp
      }
    };

    const allChats = storage.getChats();
    const updatedAllChats = allChats.map(c => c.id === activeChat.id ? updatedChat : c);
    
    storage.setChats(updatedAllChats);
    setActiveChat(updatedChat);
    setChats(updatedAllChats.filter(c => c.buyerId === user.id || c.sellerId === user.id));
    setNewMessage('');
  };

  const hasUnread = (chat: Chat) => {
    if (!user) return false;
    const lastRead = chat.lastRead?.[user.id] || 0;
    return chat.messages.some(m => m.senderId !== user.id && m.timestamp > lastRead);
  };

  if (!user) return null;

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <MessageSquare size={20} />
          <h3>Conversations</h3>
        </div>
        <div className="chat-list">
          {chats.length > 0 ? (
            chats.map(chat => (
              <div 
                key={chat.id} 
                className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="chat-item-avatar">
                  <User size={18} />
                  {hasUnread(chat) && <div className="unread-dot-sidebar"></div>}
                </div>
                <div className="chat-item-info">
                  <span className="listing-title">{chat.listingTitle}</span>
                  <span className="chat-partner">
                    {user.id === chat.buyerId ? 'Seller' : 'Buyer'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-chats">
              <MessageSquare size={32} opacity={0.3} />
              <p>No messages yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="chat-main">
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="header-info">
                <Book size={20} className="header-icon" />
                <div>
                  <h3>{activeChat.listingTitle}</h3>
                  <p>{user.id === activeChat.buyerId ? 'Chatting with Seller' : 'Chatting with Buyer'}</p>
                </div>
              </div>
            </div>
            <div className="messages-display">
              {activeChat.messages.length > 0 ? (
                activeChat.messages.map((msg, idx) => (
                  <div key={idx} className={`message-bubble ${msg.senderId === user.id ? 'sent' : 'received'}`}>
                    <p>{msg.text}</p>
                    <span className="time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
              ) : (
                <div className="start-convo">
                  <p>Send a message to start the conversation!</p>
                </div>
              )}
            </div>
            <form className="message-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-btn">
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder">
            <MessageSquare size={64} opacity={0.1} />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHub;
