import React, { useState, useEffect } from 'react';
import { User, Book, Trash2, Edit, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Listing, Genre } from '../types';
import { GENRES } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

interface ProfileProps {
  navigate: (page: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (user) {
      const allListings = storage.getListings();
      setUserListings(allListings.filter((l) => l.sellerId === user.id));
    }
  }, [user]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      storage.deleteListing(id);
      setUserListings((prev) => prev.filter((l) => l.id !== id));
      showNotification('success', 'Listing deleted successfully!');
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    storage.updateListing(editingListing);
    setUserListings((prev) =>
      prev.map((l) => (l.id === editingListing.id ? editingListing : l))
    );
    setEditingListing(null);
    showNotification('success', 'Listing updated successfully!');
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="user-avatar">
          <User size={40} />
        </div>
        <div className="user-details">
          <h1>{user.username}'s Profile</h1>
          <p>Managing your posted books and ads</p>
        </div>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="profile-section">
        <h2>Your Listings ({userListings.length})</h2>
        <div className="profile-grid">
          {userListings.length > 0 ? (
            userListings.map((listing) => (
              <div key={listing.id} className="profile-card">
                <div className="p-card-image">
                  <img src={listing.image} alt={listing.title} />
                  <span className="p-genre-tag">{listing.genre}</span>
                </div>
                <div className="p-card-content">
                  <h3>{listing.title}</h3>
                  <p className="p-price">₹{listing.price}</p>
                  <div className="p-card-actions">
                    <button className="edit-btn" onClick={() => setEditingListing(listing)}>
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(listing.id)}>
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-no-results">
              <Book size={48} />
              <p>You haven't posted any books yet.</p>
              <button className="p-cta-btn" onClick={() => navigate('post-ad')}>
                Post Your First Ad
              </button>
            </div>
          )}
        </div>
      </div>

      {editingListing && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Listing</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingListing.title}
                  onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Genre</label>
                  <select
                    value={editingListing.genre}
                    onChange={(e) => setEditingListing({ ...editingListing, genre: e.target.value as Genre })}
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={editingListing.price}
                    onChange={(e) => setEditingListing({ ...editingListing, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingListing.description}
                  onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditingListing(null)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
