import { useEffect, useState } from "react";
import "./PlayersPage.css";

interface Player {
  id: string;
  first_name: string;
  last_name: string;
  country: string;
  rank: number;
  prior_rank: number;
  abbr_name: string;
  statistics: {
    events_played: number;
    avg_points: number;
    points: number;
    points_lost: number;
    points_gained: number;
  };
}

interface ApiResponse {
  id: string;
  name: string;
  alias: string;
  status: string;
  season: number;
  players: Player[];
}

const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const getCountryCode = (country: string): string => {
    const countryMap: { [key: string]: string } = {
      "UNITED STATES": "us",
      "NORTHERN IRELAND": "gb-nir",
      ENGLAND: "gb-eng",
      SCOTLAND: "gb-sct",
      WALES: "gb-wls",
      SPAIN: "es",
      AUSTRALIA: "au",
      "SOUTH KOREA": "kr",
      JAPAN: "jp",
      NORWAY: "no",
      SWEDEN: "se",
      DENMARK: "dk",
      GERMANY: "de",
      FRANCE: "fr",
      ITALY: "it",
      CANADA: "ca",
      "SOUTH AFRICA": "za",
      ARGENTINA: "ar",
      CHILE: "cl",
      COLOMBIA: "co",
      MEXICO: "mx",
      THAILAND: "th",
      "CHINESE TAIPEI": "tw",
      CHINA: "cn",
      INDIA: "in",
      PHILIPPINES: "ph",
      "NEW ZEALAND": "nz",
      FINLAND: "fi",
      AUSTRIA: "at",
      BELGIUM: "be",
      NETHERLANDS: "nl",
      IRELAND: "ie",
      "CZECH REPUBLIC": "cz",
      SLOVENIA: "si",
    };
    return countryMap[country.toUpperCase()] || "unknown";
  };

  const getRankChange = (rank: number, priorRank: number) => {
    const change = priorRank - rank;
    if (change > 0) {
      return { type: "up", value: change, symbol: "▲" };
    } else if (change < 0) {
      return { type: "down", value: Math.abs(change), symbol: "▼" };
    } else {
      return { type: "same", value: 0, symbol: "–" };
    }
  };

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

        // Extract players from the API response
        if (data.players && Array.isArray(data.players)) {
          const playersData = data.players.slice(0, 50); // Show top 50 players

          setPlayers(playersData);
          setDebugInfo(
            `✅ Successfully loaded ${playersData.length} players from ${data.name} (${data.season})`
          );
          setError(null);
        } else {
          throw new Error("No players array found in the response");
        }
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

  const renderPlayerRow = (player: Player, index: number) => {
    const rankChange = getRankChange(player.rank, player.prior_rank);
    const countryCode = getCountryCode(player.country);

    return (
      <tr key={player.id}>
        <td className="rank-cell">
          {player.rank}
          <span className={`rank-change ${rankChange.type}`}>
            {rankChange.symbol}
          </span>
        </td>
        <td className="rank-cell">{player.prior_rank}</td>
        <td>
          <span
            className="country-flag"
            style={{
              backgroundImage:
                countryCode !== "unknown"
                  ? `url(https://flagcdn.com/20x15/${countryCode}.png)`
                  : "none",
              backgroundColor:
                countryCode === "unknown" ? "#ccc" : "transparent",
            }}
          ></span>
          {player.country}
        </td>
        <td className="player-name-cell">
          {`${player.first_name} ${player.last_name}`}
        </td>
        <td className="points-cell">
          {player.statistics.avg_points.toFixed(4)}
        </td>
        {/* <td className="points-cell">
          {player.statistics.points.toFixed(2)}
          <span className="points-change points-lost">
            {player.statistics.points_lost.toFixed(0)}
          </span>
        </td> */}
        <td className="events-cell">{player.statistics.events_played}</td>
        <td className="points-change points-lost">
          {player.statistics.points_lost.toFixed(2)}
        </td>
        <td className="points-change points-gained">
          {player.statistics.points_gained.toFixed(2)}
        </td>
      </tr>
    );
  };

  const renderLoadingRow = (index: number) => (
    <tr key={`loading-${index}`} className="loading-row">
      <td>--</td>
      <td>--</td>
      <td>--</td>
      <td>Loading...</td>
      <td>--</td>
      <td>--</td>
      <td>--</td>
      <td>--</td>
    </tr>
  );

  return (
    <div className="players-page">
      <header className="page-header">
        <h1>World Golf Rankings</h1>
        <p>Current top players in professional golf</p>
      </header>

      {/* Debug Info */}
      {/* {debugInfo && (
        <div className="debug-info">
          <small>Debug: {debugInfo}</small>
        </div>
      )} */}

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
              {/* <li><strong>Sample structure:</strong> {"id": "...", "name": "World Golf Ranking", "players": [{"id": "...", "first_name": "Scottie", "last_name": "Scheffler", "country": "UNITED STATES", "rank": 1, "statistics": {"avg_points": 18.35, "points": 752.5029}}]}</li> */}
              <li>
                <strong>Browser Console:</strong> Check for detailed error
                messages
              </li>
            </ul>
          </details>
        </div>
      )}

      <div className="table-container">
        <table className="players-table">
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Last Week</th>
              <th>Ctry</th>
              <th>Name</th>
              <th>Average Points</th>
              <th>Events Played (Divisor)</th>
              <th>Points Lost (2025)</th>
              <th>Points Won (2025)</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array(20)
                  .fill(null)
                  .map((_, index) => renderLoadingRow(index))
              : players.map((player, index) => renderPlayerRow(player, index))}
          </tbody>
        </table>
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

// import { useEffect, useState } from "react";
// import "./PlayersPage.css";

// interface Player {
//   id: string;
//   name: string;
//   country: string;
//   rank: number;
//   points: number;
// }

// interface ApiResponse {
//   rankings?: Player[];
//   players?: Player[];
//   data?: any;
//   [key: string]: any;
// }

// const PlayersPage: React.FC = () => {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [debugInfo, setDebugInfo] = useState<string>("");

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setDebugInfo("Loading data from local file...");

//         // Load from local JSON file instead of API
//         const response = await fetch("/world_rankings.json");

//         if (!response.ok) {
//           throw new Error(
//             `Failed to load world_rankings.json: ${response.status} ${response.statusText}`
//           );
//         }

//         const data: ApiResponse = await response.json();
//         console.log("Raw JSON Data:", data);
//         console.log("Response keys:", Object.keys(data));

//         // Extract players from the specific Sportradar WGR format
//         let playersData: Player[] = [];

//         if (data.players && Array.isArray(data.players)) {
//           playersData = data.players.map((player: any) => ({
//             id: player.id || "unknown",
//             name:
//               `${player.first_name || ""} ${player.last_name || ""}`.trim() ||
//               "Unknown Player",
//             country: player.country || "Unknown",
//             rank: player.rank || 0,
//             points:
//               player.statistics?.avg_points ||
//               player.statistics?.avg_points ||
//               0,
//           }));
//           setDebugInfo(
//             `Found ${playersData.length} players from Sportradar WGR format`
//           );
//         } else {
//           // Fallback to other possible formats
//           if (data.rankings && Array.isArray(data.rankings)) {
//             playersData = data.rankings.map((player: any, index: number) => ({
//               id: player.id || `player-${index + 1}`,
//               name: player.name || "Unknown Player",
//               country: player.country || player.nationality || "Unknown",
//               rank: player.rank || player.position || index + 1,
//               points: player.points || player.average_points || 0,
//             }));
//           } else if (Array.isArray(data)) {
//             playersData = data.map((player: any, index: number) => ({
//               id: player.id || `player-${index + 1}`,
//               name: player.name || player.full_name || "Unknown Player",
//               country: player.country || player.nationality || "Unknown",
//               rank: player.rank || index + 1,
//               points: player.avg_points || 0,
//             }));
//           } else {
//             // Look for any array in the response
//             const possibleArrays = Object.entries(data)
//               .filter(([key, value]) => Array.isArray(value))
//               .map(([key, value]) => ({ key, value: value as any[] }));

//             if (possibleArrays.length > 0) {
//               const arrayData = possibleArrays[0].value;
//               playersData = arrayData.map((player: any, index: number) => ({
//                 id: player.id || `player-${index + 1}`,
//                 name: player.name || player.full_name || "Unknown Player",
//                 country: player.country || player.nationality || "Unknown",
//                 rank: player.rank || index + 1,
//                 points: player.avg_points || 0,
//               }));
//               setDebugInfo(
//                 `Found ${playersData.length} players in '${possibleArrays[0].key}' field`
//               );
//             } else {
//               console.log("Unexpected data structure:", data);
//               setDebugInfo(
//                 `Unexpected response format. Keys: ${Object.keys(data).join(
//                   ", "
//                 )}`
//               );
//               throw new Error(
//                 `No player array found. Available keys: ${Object.keys(
//                   data
//                 ).join(", ")}`
//               );
//             }
//           }
//         }

//         if (playersData.length === 0) {
//           throw new Error("No player data found in response");
//         }

//         // Clean and validate the data
//         const validPlayers = playersData
//           .filter(
//             (player) =>
//               player && player.name && player.name !== "Unknown Player"
//           )
//           .slice(0, 20); // Top 20 players

//         if (validPlayers.length === 0) {
//           throw new Error("No valid player data after filtering");
//         }

//         setPlayers(validPlayers);
//         setDebugInfo(
//           `✅ Successfully loaded ${validPlayers.length} players from local file`
//         );
//         setError(null);
//       } catch (err: any) {
//         console.error("Error loading local data:", err);

//         let errorMessage = "Unknown error occurred";

//         if (err.message.includes("Failed to load world_rankings.json")) {
//           errorMessage =
//             "📁 File Not Found: Make sure world_rankings.json is in your public folder";
//         } else if (err.message.includes("Unexpected token")) {
//           errorMessage =
//             "📄 JSON Parse Error: world_rankings.json contains invalid JSON";
//         } else if (err.message.includes("No player")) {
//           errorMessage = `📊 Data Format Issue: ${err.message}`;
//         } else {
//           errorMessage = `❌ Error: ${err.message}`;
//         }

//         setError(errorMessage);
//         setDebugInfo(`Error: ${err.message}`);
//         setPlayers([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlayers();
//   }, []);

//   const renderPlayerCard = (player: Player | null, index: number) => (
//     <div key={index} className="player-card">
//       {player ? (
//         <>
//           <div className="player-rank">#{player.rank}</div>
//           <h3 className="player-name">{player.name}</h3>
//           <p className="player-country">{player.country}</p>
//           <div className="player-points">
//             {typeof player.points === "number" && player.points > 0
//               ? `${player.points.toFixed(3)} points`
//               : "N/A points"}
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="player-rank placeholder">#--</div>
//           <h3 className="player-name placeholder">Loading...</h3>
//           <p className="player-country placeholder">--</p>
//           <div className="player-points placeholder">--Average points</div>
//         </>
//       )}
//     </div>
//   );

//   return (
//     <div className="players-page">
//       <header className="page-header">
//         <h1>World Golf Rankings</h1>
//         <p>Current top players in professional golf</p>
//       </header>

//       {/* Debug Info */}
//       {debugInfo && (
//         <div className="debug-info">
//           <small>Debug: {debugInfo}</small>
//         </div>
//       )}

//       {loading && (
//         <div className="loading-container">
//           <p>Loading players from local data...</p>
//         </div>
//       )}

//       {error && (
//         <div className="error-container">
//           <h3>🚨 Data Loading Issue</h3>
//           <p>
//             <strong>Error:</strong> {error}
//           </p>
//           <details>
//             <summary>Setup Instructions</summary>
//             <ul>
//               <li>
//                 <strong>Create the file:</strong> Add world_rankings.json to
//                 your public folder
//               </li>
//               <li>
//                 <strong>File location:</strong> public/world_rankings.json (in
//                 React apps)
//               </li>
//               <li>
//                 <strong>JSON format:</strong> Make sure the file contains valid
//                 JSON
//               </li>
//               {/* <li><strong>Sample structure:</strong> {"id": "...", "name": "World Golf Ranking", "players": [{"id": "...", "first_name": "Scottie", "last_name": "Scheffler", "country": "UNITED STATES", "rank": 1, "statistics": {"points": 752.5}}]}</li> */}
//               <li>
//                 <strong>Browser Console:</strong> Check for detailed error
//                 messages
//               </li>
//             </ul>
//           </details>
//         </div>
//       )}

//       <div className="players-grid">
//         {Array(20)
//           .fill(null)
//           .map((_, index) => renderPlayerCard(players[index] || null, index))}
//       </div>

//       <footer className="page-footer">
//         <p>
//           {players.length > 0
//             ? `Showing ${players.length} players • Data from local file`
//             : "Data from local file"}
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default PlayersPage;
