import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
      {/* <div style={{ backgroundColor: 'blue' }}></div> */}
        <h1 style={{ 
          fontSize: '3rem', 
          color: '#2c5530',
          marginBottom: '1rem',
        }}>
          Golf World Rankings
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Welcome to the official World Golf Rankings portal. 
          Track the latest player rankings and statistics from the professional golf circuit.
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f9f9f9'
        }}>
          <h3 style={{ color: '#2c5530', marginBottom: '1rem' }}>
            Current Rankings
          </h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            View the latest World Golf Rankings with up-to-date player positions and statistics.
          </p>
          <Link 
            to="/players"
            style={{
              backgroundColor: '#2c5530',
              color: 'white',
              padding: '0.75rem 1.5rem',
              textDecoration: 'none',
              borderRadius: '5px',
              display: 'inline-block',
              fontWeight: 'bold'
            }}
          >
            View Players
          </Link>
        </div>

        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f9f9f9'
        }}>
          <h3 style={{ color: '#2c5530', marginBottom: '1rem' }}>
            Live Updates
          </h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Rankings are updated regularly to reflect the latest tournament results and player performances.
          </p>
          <div style={{
            backgroundColor: '#e8f5e8',
            color: '#2c5530',
            padding: '0.75rem 1.5rem',
            borderRadius: '5px',
            display: 'inline-block',
            fontWeight: 'bold'
          }}>
            Data Current
          </div>
        </div>
      </div>

      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem 0',
        borderTop: '1px solid #eee',
        color: '#666'
      }}>
        <p>Powered by Sportradar API | World Golf Rankings</p>
      </footer>
    </div>
  );
};

export default HomePage;
