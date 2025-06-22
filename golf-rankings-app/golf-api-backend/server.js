const fs = require("fs");
const axios = require("axios");

// Better to use environment variables for API keys
const API_KEY =
  process.env.SPORTRADAR_API_KEY || "VmI0K6O5QLl4C7PBOxGl46rBnfaemkzs0SOVokjP";
const URL =
  "https://api.sportradar.com/golf/trial/v3/en/players/wgr/2025/rankings.json";
const TOURNAMENT_URL =
  "https://api.sportradar.com/golf/trial/pga/v3/en/2025/tournaments/schedule.json";

async function fetchWorldGolfRankings() {
  try {
    const response = await axios.get(URL, {
      params: { api_key: API_KEY },
      timeout: 10000,
    });
    const data = response.data;
    fs.writeFileSync("world_rankings.json", JSON.stringify(data, null, 2));
    console.log("World Golf Rankings saved to world_rankings.json");
  } catch (error) {
    console.error("Error fetching rankings:", error.message);
  }
}

async function fetchWorldGolfTournaments() {
  try {
    const response = await axios.get(TOURNAMENT_URL, {
      params: { api_key: API_KEY },
      timeout: 10000,
    });
    const data = response.data;
    fs.writeFileSync("tournament_schedule.json", JSON.stringify(data, null, 2));
    console.log("Tournament schedule saved to tournament_schedule.json");
  } catch (error) {
    console.error("Error fetching tournaments:", error.message);
  }
}

// Run both functions
async function main() {
  await fetchWorldGolfRankings();
  await fetchWorldGolfTournaments();
}

main();
