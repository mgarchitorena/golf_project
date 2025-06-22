import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface CreateGroupPageProps {
  isLoggedIn: boolean;
}

const CreateGroupPage: React.FC<CreateGroupPageProps> = ({ isLoggedIn }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxMembers, setMaxMembers] = useState(10);
  const [entryFee, setEntryFee] = useState(0);
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to an API
    console.log('Creating group:', { groupName, description, isPrivate, maxMembers, entryFee });
    navigate('/groups');
  };

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
      <h1 style={{ color: '#2c5530', marginBottom: '2rem' }}>Create New Group</h1>
      
      <div style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={inputStyle}
              required
              placeholder="Enter group name"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{...inputStyle, height: '100px', resize: 'vertical'}}
              placeholder="Describe your group..."
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Maximum Members
            </label>
            <input
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              style={inputStyle}
              min="2"
              max="100"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Entry Fee ($)
            </label>
            <input
              type="number"
              value={entryFee}
              onChange={(e) => setEntryFee(Number(e.target.value))}
              style={inputStyle}
              min="0"
              step="0.01"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Private Group (invite only)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#2c5530',
                color: 'white',
                padding: '0.75rem 2rem',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Create Group
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/groups')}
              style={{
                backgroundColor: '#999',
                color: 'white',
                padding: '0.75rem 2rem',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPage;
