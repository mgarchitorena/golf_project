// App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import PlayersPage from "./PlayersPage";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import CreateGroupPage from "./CreateGroupPage";
import ViewGroupPage from "./ViewGroupPage";
import GroupsListPage from "./GroupsListPage";
// import LeaderboardPage from './LeaderboardPage';
import TournamentsPage from "./Tournaments";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-content">
            <div className="nav-links">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/players" className="nav-link">
                Players
              </Link>
              <Link to="/tournaments" className="nav-link">
                Tournaments
              </Link>
              <Link to="/leaderboard" className="nav-link">
                Leaderboard
              </Link>
              {isLoggedIn && (
                <>
                  <Link to="/groups" className="nav-link">
                    Groups
                  </Link>
                  <Link to="/create-group" className="nav-link">
                    Create Group
                  </Link>
                </>
              )}
            </div>
            <div className="nav-auth">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="profile-link">
                    Welcome, {currentUser}
                  </Link>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="login-btn">
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            {/* <Route path="/leaderboard" element={<LeaderboardPage />} /> */}
            <Route
              path="/login"
              element={<LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  currentUser={currentUser}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/groups"
              element={<GroupsListPage />}
              //  isLoggedIn={isLoggedIn}
            />
            <Route
              path="/create-group"
              element={<CreateGroupPage isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/group/:id"
              element={<ViewGroupPage isLoggedIn={isLoggedIn} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
// {
//   /* <TODO> ALLOW PLAYERS TO CREATE A GROUP TO BET ON A SPECIFIC TOURNAMENT. THEY OPEN THAT TOURNAMENT AND ARE ABLE TO BET ON THE PLAYERS IN THAT SPECIFIC TOURNAMENT.
//   LOOK ON GOLF WEBSITE, HAS THE TOURNAMENT AND THE PLAYERS IN IT
//   </TODO> */
// }
