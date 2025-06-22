import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProfilePageProps {
  currentUser: string | null;
  isLoggedIn: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, isLoggedIn }) => {
  const [favoritePlayer, setFavoritePlayer] = useState('Tiger Woods');
  const [notifications, setNotifications] = useState(true);
  const [bio, setBio] = useState('Golf enthusiast and weekend warrior');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    marginBottom: '1rem'
  };

  return (
    <div>
      <h1 style={{ color: '#2c5530', marginBottom: '2rem' }}>Profile</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ color: '#2c5530', marginBottom: '1rem' }}>Personal Information</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Username
            </label>
            <input 
              type="text" 
              value={currentUser || ''} 
              disabled 
              style={{...inputStyle, backgroundColor: '#eee'}}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Bio
            </label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{...inputStyle, height: '100px', resize: 'vertical'}}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Favorite Player
            </label>
            <input 
              type="text" 
              value={favoritePlayer}
              onChange={(e) => setFavoritePlayer(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ color: '#2c5530', marginBottom: '1rem' }}>Statistics</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Groups Joined:</span>
              <strong>3</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Groups Created:</span>
              <strong>1</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Total Points:</span>
              <strong>1,250</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Rank:</span>
              <strong>#42</strong>
            </div>
          </div>

          <h3 style={{ color: '#2c5530', marginTop: '2rem', marginBottom: '1rem' }}>Settings</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Email Notifications
            </label>
          </div>
        </div>
      </div>

      <button style={{
        backgroundColor: '#2c5530',
        color: 'white',
        padding: '0.75rem 2rem',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        Save Changes
      </button>
    </div>
  );
};

export default ProfilePage;
