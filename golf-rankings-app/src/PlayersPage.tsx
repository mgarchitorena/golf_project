import { useEffect, useState } from "react";
import "./PlayersPage.css";

interface Player {
  id: string;
  name: string;
  country: string;
  rank: number;
  points: number;
}

interface ApiResponse {
  rankings?: Player[];
  players?: Player[];
  data?: any;
  [key: string]: any;
}

const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo("Loading data from local file...");

        // Load from local JSON file instead of API
        const response = await fetch("/world_rankings.json");

        if (!response.ok) {
          throw new Error(
            `Failed to load world_rankings.json: ${response.status} ${response.statusText}`
          );
        }

        const data: ApiResponse = await response.json();
        console.log("Raw JSON Data:", data);
        console.log("Response keys:", Object.keys(data));

        // Extract players from the specific Sportradar WGR format
        let playersData: Player[] = [];

        if (data.players && Array.isArray(data.players)) {
          playersData = data.players.map((player: any) => ({
            id: player.id || "unknown",
            name:
              `${player.first_name || ""} ${player.last_name || ""}`.trim() ||
              "Unknown Player",
            country: player.country || "Unknown",
            rank: player.rank || 0,
            points:
              player.statistics?.avg_points ||
              player.statistics?.avg_points ||
              0,
          }));
          setDebugInfo(
            `Found ${playersData.length} players from Sportradar WGR format`
          );
        } else {
          // Fallback to other possible formats
          if (data.rankings && Array.isArray(data.rankings)) {
            playersData = data.rankings.map((player: any, index: number) => ({
              id: player.id || `player-${index + 1}`,
              name: player.name || "Unknown Player",
              country: player.country || player.nationality || "Unknown",
              rank: player.rank || player.position || index + 1,
              points: player.points || player.average_points || 0,
            }));
          } else if (Array.isArray(data)) {
            playersData = data.map((player: any, index: number) => ({
              id: player.id || `player-${index + 1}`,
              name: player.name || player.full_name || "Unknown Player",
              country: player.country || player.nationality || "Unknown",
              rank: player.rank || index + 1,
              points: player.avg_points || 0,
            }));
          } else {
            // Look for any array in the response
            const possibleArrays = Object.entries(data)
              .filter(([key, value]) => Array.isArray(value))
              .map(([key, value]) => ({ key, value: value as any[] }));

            if (possibleArrays.length > 0) {
              const arrayData = possibleArrays[0].value;
              playersData = arrayData.map((player: any, index: number) => ({
                id: player.id || `player-${index + 1}`,
                name: player.name || player.full_name || "Unknown Player",
                country: player.country || player.nationality || "Unknown",
                rank: player.rank || index + 1,
                points: player.avg_points || 0,
              }));
              setDebugInfo(
                `Found ${playersData.length} players in '${possibleArrays[0].key}' field`
              );
            } else {
              console.log("Unexpected data structure:", data);
              setDebugInfo(
                `Unexpected response format. Keys: ${Object.keys(data).join(
                  ", "
                )}`
              );
              throw new Error(
                `No player array found. Available keys: ${Object.keys(
                  data
                ).join(", ")}`
              );
            }
          }
        }

        if (playersData.length === 0) {
          throw new Error("No player data found in response");
        }

        // Clean and validate the data
        const validPlayers = playersData
          .filter(
            (player) =>
              player && player.name && player.name !== "Unknown Player"
          )
          .slice(0, 20); // Top 20 players

        if (validPlayers.length === 0) {
          throw new Error("No valid player data after filtering");
        }

        setPlayers(validPlayers);
        setDebugInfo(
          `✅ Successfully loaded ${validPlayers.length} players from local file`
        );
        setError(null);
      } catch (err: any) {
        console.error("Error loading local data:", err);

        let errorMessage = "Unknown error occurred";

        if (err.message.includes("Failed to load world_rankings.json")) {
          errorMessage =
            "📁 File Not Found: Make sure world_rankings.json is in your public folder";
        } else if (err.message.includes("Unexpected token")) {
          errorMessage =
            "📄 JSON Parse Error: world_rankings.json contains invalid JSON";
        } else if (err.message.includes("No player")) {
          errorMessage = `📊 Data Format Issue: ${err.message}`;
        } else {
          errorMessage = `❌ Error: ${err.message}`;
        }

        setError(errorMessage);
        setDebugInfo(`Error: ${err.message}`);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const renderPlayerCard = (player: Player | null, index: number) => (
    <div key={index} className="player-card">
      {player ? (
        <>
          <div className="player-rank">#{player.rank}</div>
          <h3 className="player-name">{player.name}</h3>
          <p className="player-country">{player.country}</p>
          <div className="player-points">
            {typeof player.points === "number" && player.points > 0
              ? `${player.points.toFixed(3)} points`
              : "N/A points"}
          </div>
        </>
      ) : (
        <>
          <div className="player-rank placeholder">#--</div>
          <h3 className="player-name placeholder">Loading...</h3>
          <p className="player-country placeholder">--</p>
          <div className="player-points placeholder">--Average points</div>
        </>
      )}
    </div>
  );

  return (
    <div className="players-page">
      <header className="page-header">
        <h1>World Golf Rankings</h1>
        <p>Current top players in professional golf</p>
      </header>

      {/* Debug Info */}
      {debugInfo && (
        <div className="debug-info">
          <small>Debug: {debugInfo}</small>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <p>Loading players from local data...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <h3>🚨 Data Loading Issue</h3>
          <p>
            <strong>Error:</strong> {error}
          </p>
          <details>
            <summary>Setup Instructions</summary>
            <ul>
              <li>
                <strong>Create the file:</strong> Add world_rankings.json to
                your public folder
              </li>
              <li>
                <strong>File location:</strong> public/world_rankings.json (in
                React apps)
              </li>
              <li>
                <strong>JSON format:</strong> Make sure the file contains valid
                JSON
              </li>
              {/* <li><strong>Sample structure:</strong> {"id": "...", "name": "World Golf Ranking", "players": [{"id": "...", "first_name": "Scottie", "last_name": "Scheffler", "country": "UNITED STATES", "rank": 1, "statistics": {"points": 752.5}}]}</li> */}
              <li>
                <strong>Browser Console:</strong> Check for detailed error
                messages
              </li>
            </ul>
          </details>
        </div>
      )}

      <div className="players-grid">
        {Array(20)
          .fill(null)
          .map((_, index) => renderPlayerCard(players[index] || null, index))}
      </div>

      <footer className="page-footer">
        <p>
          {players.length > 0
            ? `Showing ${players.length} players • Data from local file`
            : "Data from local file"}
        </p>
      </footer>
    </div>
  );
};

export default PlayersPage;
