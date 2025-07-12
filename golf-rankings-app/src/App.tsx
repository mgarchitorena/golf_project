import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { GroupsProvider } from "./GroupsContext"; // Import the GroupsProvider
import HomePage from "./HomePage";
import PlayersPage from "./PlayersPage";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import CreateGroupPage from "./CreateGroupPage";
import ViewGroupPage from "./ViewGroupPage";
import GroupsListPage from "./GroupsListPage";
import TournamentsPage from "./Tournaments";
import PickTeams from "./PickTeams";
import MemberTeams from "./MemberTeams";
import "./App.css";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>("current_user"); // Set a default user

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <GroupsProvider>
      {" "}
      {/* Wrap everything with GroupsProvider */}
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
              <Route
                path="/login"
                element={<LoginPage onLogin={handleLogin} />}
              />
              <Route path="/pick-teams/:groupId" element={<PickTeams />} />
              <Route path="/memberteams" element={<MemberTeams />} />

              <Route
                path="/profile"
                element={
                  <ProfilePage
                    currentUser={currentUser}
                    isLoggedIn={isLoggedIn}
                  />
                }
              />
              <Route path="/groups" element={<GroupsListPage />} />
              <Route path="/create-group" element={<CreateGroupPage />} />
              <Route path="/group/:id" element={<ViewGroupPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </GroupsProvider>
  );
};

export default App;
