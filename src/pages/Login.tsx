import React, { useState } from 'react';
import { UserCircle, KeyRound, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (login(username, password)) {
        onLogin();
      } else {
        setError('Invalid username or password');
      }
    } else {
      if (signup(username, password)) {
        onLogin();
      } else {
        setError('Username already exists');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-header">
          <BookOpen size={40} className="brand-icon" />
          <h2>BOOKO</h2>
          <p>{isLogin ? 'Sign in to continue' : 'Create your account'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-with-icon">
              <UserCircle size={20} className="input-icon" />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Enter your username"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <KeyRound size={20} className="input-icon" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter your password"
              />
            </div>
          </div>
          {error && <div className="login-error-msg">{error}</div>}
          <button type="submit" className="login-submit-btn">
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <p className="toggle-auth">
          {isLogin ? "New to Booko? " : "Already have an account? "}
          <span onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
