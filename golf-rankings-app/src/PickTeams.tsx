import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PickTeams.css";

interface Player {
  id: string;
  name: string;
  country: string;
  rank: number;
  points: number;
  status: "active" | "withdrawn" | "replacement";
  teedOff?: boolean;
}

interface SelectedPlayer extends Player {
  selectedAt: Date;
}

const PickTeams: React.FC = () => {
  const navigate = useNavigate();
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "points" | "name">("rank");
  const [isThursday, setIsThursday] = useState(false); // Toggle for Thursday rule

  const MAX_PLAYERS = 8;
  const MAX_POINTS = 35.0;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/world_rankings.json");

        if (!response.ok) {
          throw new Error(
            `Failed to load world_rankings.json: ${response.status}`
          );
        }

        const data = await response.json();
        let playersData: Player[] = [];

        // Extract players from the data structure (same logic as PlayersPage)
        if (data.players && Array.isArray(data.players)) {
          playersData = data.players.map((player: any) => ({
            id: player.id || "unknown",
            name:
              `${player.first_name || ""} ${player.last_name || ""}`.trim() ||
              "Unknown Player",
            country: player.country || "Unknown",
            rank: player.rank || 0,
            points: player.statistics?.avg_points || 0,
            status: "active" as const,
            teedOff: false,
          }));
        }

        // Filter and validate players
        const validPlayers = playersData
          .filter(
            (player) =>
              player && player.name && player.name !== "Unknown Player"
          )
          .sort((a, b) => a.rank - b.rank);

        setAvailablePlayers(validPlayers);
      } catch (err: any) {
        console.error("Error loading players:", err);
        setError(`Failed to load players: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const getTotalPoints = () => {
    return selectedPlayers.reduce((total, player) => total + player.points, 0);
  };

  const canAddPlayer = (player: Player) => {
    if (selectedPlayers.length >= MAX_PLAYERS) return false;
    if (selectedPlayers.some((p) => p.id === player.id)) return false;
    if (getTotalPoints() + player.points > MAX_POINTS) return false;
    return true;
  };

  const canReplacePlayer = (newPlayer: Player, oldPlayer: SelectedPlayer) => {
    const pointsWithoutOld = getTotalPoints() - oldPlayer.points;
    if (pointsWithoutOld + newPlayer.points > MAX_POINTS) return false;
    if (isThursday && newPlayer.teedOff) return false;
    return true;
  };

  const addPlayer = (player: Player) => {
    if (canAddPlayer(player)) {
      setSelectedPlayers([
        ...selectedPlayers,
        { ...player, selectedAt: new Date() },
      ]);
    }
  };

  const removePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
  };

  const replacePlayer = (oldPlayerId: string, newPlayer: Player) => {
    const oldPlayer = selectedPlayers.find((p) => p.id === oldPlayerId);
    if (oldPlayer && canReplacePlayer(newPlayer, oldPlayer)) {
      setSelectedPlayers(
        selectedPlayers.map((p) =>
          p.id === oldPlayerId ? { ...newPlayer, selectedAt: new Date() } : p
        )
      );
    }
  };

  const filteredPlayers = availablePlayers
    .filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.country.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rank":
          return a.rank - b.rank;
        case "points":
          return b.points - a.points;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const saveTeam = () => {
    if (selectedPlayers.length === MAX_PLAYERS) {
      // Here you would typically save to backend
      console.log("Team saved:", selectedPlayers);
      alert("Team saved successfully!");
      navigate("/groups");
    } else {
      alert(`Please select exactly ${MAX_PLAYERS} players`);
    }
  };

  if (loading) {
    return (
      <div className="pick-teams-page">
        <div className="loading">Loading players...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pick-teams-page">
        <div className="error">
          <h3>Error Loading Players</h3>
          <p>{error}</p>
          <button onClick={() => navigate("/groups")}>Back to Groups</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pick-teams-page">
      <header className="pick-teams-header">
        <button onClick={() => navigate("/groups")} className="back-button">
          ← Back to Groups
        </button>
        <h1>Pick Your Team</h1>
        <div className="team-constraints">
          <p>
            Select exactly {MAX_PLAYERS} golfers • Max {MAX_POINTS} points total
          </p>
        </div>
      </header>

      <div className="pick-teams-content">
        {/* Selected Team Section */}
        <div className="selected-team-section">
          <div className="team-header">
            <h2>
              Your Team ({selectedPlayers.length}/{MAX_PLAYERS})
            </h2>
            <div className="team-stats">
              <span
                className={`points-total ${
                  getTotalPoints() > MAX_POINTS ? "over-limit" : ""
                }`}
              >
                {getTotalPoints().toFixed(3)} / {MAX_POINTS} points
              </span>
            </div>
          </div>

          <div className="selected-players">
            {Array(MAX_PLAYERS)
              .fill(null)
              .map((_, index) => {
                const player = selectedPlayers[index];
                return (
                  <div
                    key={index}
                    className={`selected-player-card ${!player ? "empty" : ""}`}
                  >
                    {player ? (
                      <>
                        <div className="player-info">
                          <div className="player-rank">#{player.rank}</div>
                          <div className="player-details">
                            <h4>{player.name}</h4>
                            <p>{player.country}</p>
                            <span className="player-points">
                              {player.points.toFixed(3)} pts
                            </span>
                          </div>
                        </div>
                        <div className="player-actions">
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="remove-button"
                            title="Remove player"
                          >
                            ×
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="empty-slot">
                        <span>Empty Slot {index + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          <div className="team-actions">
            <button
              onClick={saveTeam}
              disabled={
                selectedPlayers.length !== MAX_PLAYERS ||
                getTotalPoints() > MAX_POINTS
              }
              className="save-team-button"
            >
              Save Team
            </button>
          </div>
        </div>

        {/* Available Players Section */}
        <div className="available-players-section">
          <div className="players-header">
            <h2>Available Players</h2>
            <div className="controls">
              <div className="search-controls">
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "rank" | "points" | "name")
                  }
                  className="sort-select"
                >
                  <option value="rank">Sort by Rank</option>
                  <option value="points">Sort by Points</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
              <div className="thursday-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={isThursday}
                    onChange={(e) => setIsThursday(e.target.checked)}
                  />
                  Thursday (restrict teed-off players)
                </label>
              </div>
            </div>
          </div>

          <div className="available-players-grid">
            {filteredPlayers.map((player) => {
              const isSelected = selectedPlayers.some(
                (p) => p.id === player.id
              );
              const canAdd = canAddPlayer(player);

              return (
                <div
                  key={player.id}
                  className={`player-card ${isSelected ? "selected" : ""} ${
                    !canAdd && !isSelected ? "disabled" : ""
                  }`}
                >
                  <div className="player-rank">#{player.rank}</div>
                  <h4 className="player-name">{player.name}</h4>
                  <p className="player-country">{player.country}</p>
                  <div className="player-points">
                    {player.points.toFixed(3)} points
                  </div>

                  <div className="player-card-actions">
                    {isSelected ? (
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="remove-button"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => addPlayer(player)}
                        disabled={!canAdd}
                        className="add-button"
                        title={
                          !canAdd
                            ? "Cannot add: team full, already selected, or would exceed point limit"
                            : "Add to team"
                        }
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rules Panel */}
      <div className="rules-panel">
        <h3>Team Selection Rules</h3>
        <ul>
          <li>Select exactly {MAX_PLAYERS} golfers for your team</li>
          <li>Team point total cannot exceed {MAX_POINTS} points</li>
          <li>
            If a golfer withdraws before tournament start, you can replace them
          </li>
          <li>Replacement players must keep team under {MAX_POINTS} points</li>
          <li>
            Thursday replacements cannot include players who have teed off
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PickTeams;
