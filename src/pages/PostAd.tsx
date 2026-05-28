import React, { useState } from 'react';
import { Upload, BookPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { GENRES } from '../types';
import type { Genre, Listing } from '../types';
import './PostAd.css';

interface PostAdProps {
  navigate: (page: any) => void;
}

const PostAd: React.FC<PostAdProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState<Genre>('Fiction');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setImage(compressedDataUrl);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !image) return;

    setIsSubmitting(true);
    const newList: Listing = {
      id: Math.random().toString(36).substr(2, 9),
      sellerId: user.id,
      sellerName: user.username,
      title,
      description,
      genre,
      price: parseFloat(price),
      image,
      createdAt: Date.now()
    };

    const listings = storage.getListings();
    storage.setListings([newList, ...listings]);
    
    setTimeout(() => {
      navigate('home');
    }, 800);
  };

  return (
    <div className="post-ad-container">
      <div className="post-ad-card">
        <div className="post-header">
          <BookPlus size={32} className="header-icon" />
          <h2>Sell Your Book</h2>
          <p>Fill in the details to reach thousands of readers</p>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Book Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="e.g. The Immortals of Meluha"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Genre</label>
              <select value={genre} onChange={(e) => setGenre(e.target.value as Genre)}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Condition & Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              placeholder="Mention the book's condition (e.g., Like New, Minor Wear) and any other details."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Book Cover Photo</label>
            <div className={`image-upload-box ${image ? 'has-image' : ''}`}>
              {image ? (
                <div className="preview-container">
                  <img src={image} alt="Preview" />
                  <div className="change-overlay">Click to change</div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={40} />
                  <span>Click or Drag to Upload</span>
                  <p>JPEG or PNG, Max 2MB</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} required={!image} />
            </div>
          </div>

          <button type="submit" className="post-submit-btn" disabled={isSubmitting || !image}>
            {isSubmitting ? 'Publishing...' : 'Publish Ad'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostAd;
