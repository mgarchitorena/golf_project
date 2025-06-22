import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1 className="homepage-title">Golf World Rankings</h1>
        <p className="homepage-subtitle">
          Welcome to the official World Golf Rankings portal. Track the latest
          player rankings and statistics from the professional golf circuit.
        </p>
      </header>

      <div className="homepage-cards">
        <div className="homepage-card">
          <h3 className="homepage-card-title">Current Rankings</h3>
          <p className="homepage-card-description">
            View the latest World Golf Rankings with up-to-date player positions
            and statistics.
          </p>
          <Link to="/players" className="homepage-btn">
            View Players
          </Link>
        </div>

        <div className="homepage-card">
          <h3 className="homepage-card-title">Live Updates</h3>
          <p className="homepage-card-description">
            Rankings are updated regularly to reflect the latest tournament
            results and player performances.
          </p>
          <div className="status-indicator">Data Current</div>
        </div>
      </div>

      <footer className="homepage-footer">
        <p>Powered by Sportradar API | World Golf Rankings</p>
      </footer>
    </div>
  );
};

export default HomePage;
