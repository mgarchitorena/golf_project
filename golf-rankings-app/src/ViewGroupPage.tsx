import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

interface ViewGroupPageProps {
  isLoggedIn: boolean;
}

interface Member {
  id: string;
  username: string;
  points: number;
  rank: number;
  joinDate: string;
}

const ViewGroupPage: React.FC<ViewGroupPageProps> = ({ isLoggedIn }) => {
  const { id } = useParams();
  const [isMember, setIsMember] = useState(true);
  
  // Mock data - in a real app, this would come from an API
  const groupData = {
    id: id,
    name: 'Weekend Warriors',
    description: 'Casual golf betting group for weekend tournaments',
    members: 8,
    maxMembers: 12,
    entryFee: 25,
    totalPrize: 200,
    isPrivate: false,
    owner: 'golfpro123'
  };

  const members: Member[] = [
    { id: '1', username: 'golfpro123', points: 1450, rank: 1, joinDate: '2025-01-15' },
    { id: '2', username: 'tiger_fan', points: 1320, rank: 2, joinDate: '2025-01-20' },
    { id: '3', username: 'weekend_golfer', points: 1180, rank: 3, joinDate: '2025-02-01' },
    { id: '4', username: 'birdie_hunter', points: 1050, rank: 4, joinDate: '2025-02-05' },
    { id: '5', username: 'fairway_finder', points: 980, rank: 5, joinDate: '2025-02-10' },
  ];

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c5530' }}>{groupData.name}</h1>
        {!isMember ? (
          <button
            onClick={() => setIsMember(true)}
            style={{
              backgroundColor: '#2c5530',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Join Group (${groupData.entryFee})
          </button>
        ) : (
          <button
            onClick={() => setIsMember(false)}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Leave Group
          </button>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ color: '#2c5530', marginBottom: '1rem' }}>Group Information</h2>
          <p style={{ marginBottom: '1rem' }}>{groupData.description}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <strong>Owner:</strong> {groupData.owner}
            </div>
            <div>
              <strong>Members:</strong> {groupData.members}/{groupData.maxMembers}
            </div>
            <div>
              <strong>Entry Fee:</strong> ${groupData.entryFee}
            </div>
            <div>
              <strong>Total Prize:</strong> ${groupData.totalPrize}
            </div>
            <div>
              <strong>Type:</strong> {groupData.isPrivate ? 'Private' : 'Public'}
            </div>
          </div>
        </div>

        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ color: '#2c5530', marginBottom: '1rem' }}>Quick Stats</h2>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c5530' }}>
              ${groupData.totalPrize}
            </div>
            <div style={{ color: '#666', marginBottom: '1rem' }}>Total Prize Pool</div>
            
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c5530' }}>
              {groupData.members}
            </div>
            <div style={{ color: '#666' }}>Active Members</div>
          </div>
        </div>
      </div>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '2rem',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ color: '#2c5530', marginBottom: '1rem' }}>Leaderboard</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Rank</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Username</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Points</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Join Date</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      backgroundColor: member.rank <= 3 ? '#2c5530' : '#999',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      #{member.rank}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{member.username}</td>
                  <td style={{ padding: '1rem' }}>{member.points}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>{member.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewGroupPage;
