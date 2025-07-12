// server.js - Integrated Golf Rankings & Authentication Server
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "1234";

// SportRadar API Configuration
const API_KEY =
  process.env.SPORTRADAR_API_KEY || "VmI0K6O5QLl4C7PBOxGl46rBnfaemkzs0SOVokjP";
const RANKINGS_URL =
  "https://api.sportradar.com/golf/trial/v3/en/players/wgr/2025/rankings.json";
const TOURNAMENT_URL =
  "https://api.sportradar.com/golf/trial/pga/v3/en/2025/tournaments/schedule.json";

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");

    // Create users table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
      (err) => {
        if (err) {
          console.error("Error creating users table:", err.message);
        } else {
          console.log("Users table ready");
        }
      }
    );
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// =============================================================================
// AUTHENTICATION ENDPOINTS
// =============================================================================

// Signup endpoint
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    db.get(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email],
      async (err, row) => {
        if (err) {
          console.error("Database error:", err.message);
          return res.status(500).json({ message: "Database error" });
        }

        if (row) {
          return res
            .status(409)
            .json({ message: "Username or email already exists" });
        }

        try {
          // Hash password
          const saltRounds = 10;
          const passwordHash = await bcrypt.hash(password, saltRounds);

          // Insert new user
          db.run(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            [username, email, passwordHash],
            function (err) {
              if (err) {
                console.error("Error inserting user:", err.message);
                return res.status(500).json({ message: "Error creating user" });
              }

              // Generate JWT token
              const token = jwt.sign(
                { userId: this.lastID, username: username },
                JWT_SECRET,
                { expiresIn: "24h" }
              );

              res.status(201).json({
                message: "User created successfully",
                token: token,
                user: {
                  id: this.lastID,
                  username: username,
                  email: email,
                },
              });
            }
          );
        } catch (hashError) {
          console.error("Error hashing password:", hashError);
          res.status(500).json({ message: "Error processing password" });
        }
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login endpoint
app.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find user in database
    db.get(
      "SELECT id, username, email, password_hash FROM users WHERE username = ?",
      [username],
      async (err, row) => {
        if (err) {
          console.error("Database error:", err.message);
          return res.status(500).json({ message: "Database error" });
        }

        if (!row) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        try {
          // Compare password
          const isValidPassword = await bcrypt.compare(
            password,
            row.password_hash
          );

          if (!isValidPassword) {
            return res
              .status(401)
              .json({ message: "Invalid username or password" });
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: row.id, username: row.username },
            JWT_SECRET,
            { expiresIn: "24h" }
          );

          res.json({
            message: "Login successful",
            token: token,
            user: {
              id: row.id,
              username: row.username,
              email: row.email,
            },
          });
        } catch (compareError) {
          console.error("Error comparing password:", compareError);
          res.status(500).json({ message: "Error verifying password" });
        }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user profile (protected)
app.get("/api/profile", authenticateToken, (req, res) => {
  db.get(
    "SELECT id, username, email, created_at FROM users WHERE id = ?",
    [req.user.userId],
    (err, row) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).json({ message: "Database error" });
      }

      if (!row) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        user: {
          id: row.id,
          username: row.username,
          email: row.email,
          createdAt: row.created_at,
        },
      });
    }
  );
});

// Token validation endpoint
app.post("/api/validate-token", authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user.userId,
      username: req.user.username,
    },
  });
});

// =============================================================================
// GOLF DATA ENDPOINTS
// =============================================================================

// Helper function to fetch world golf rankings
async function fetchWorldGolfRankings() {
  try {
    const response = await axios.get(RANKINGS_URL, {
      params: { api_key: API_KEY },
      timeout: 10000,
    });
    const data = response.data;
    fs.writeFileSync("world_rankings.json", JSON.stringify(data, null, 2));
    console.log("World Golf Rankings saved to world_rankings.json");
    return data;
  } catch (error) {
    console.error("Error fetching rankings:", error.message);
    throw error;
  }
}

// Helper function to fetch tournament schedule
async function fetchWorldGolfTournaments() {
  try {
    const response = await axios.get(TOURNAMENT_URL, {
      params: { api_key: API_KEY },
      timeout: 10000,
    });
    const data = response.data;
    fs.writeFileSync("tournament_schedule.json", JSON.stringify(data, null, 2));
    console.log("Tournament schedule saved to tournament_schedule.json");
    return data;
  } catch (error) {
    console.error("Error fetching tournaments:", error.message);
    throw error;
  }
}

// Get world golf rankings (protected endpoint)
app.get("/api/rankings", authenticateToken, async (req, res) => {
  try {
    // Try to read from file first
    if (fs.existsSync("world_rankings.json")) {
      const fileData = fs.readFileSync("world_rankings.json", "utf8");
      const rankings = JSON.parse(fileData);
      res.json(rankings);
    } else {
      // If file doesn't exist, fetch from API
      const rankings = await fetchWorldGolfRankings();
      res.json(rankings);
    }
  } catch (error) {
    console.error("Error getting rankings:", error.message);
    res.status(500).json({
      message: "Error retrieving rankings",
      error: error.message,
    });
  }
});

// Get tournament schedule (protected endpoint)
app.get("/api/tournaments", authenticateToken, async (req, res) => {
  try {
    // Try to read from file first
    if (fs.existsSync("tournament_schedule.json")) {
      const fileData = fs.readFileSync("tournament_schedule.json", "utf8");
      const tournaments = JSON.parse(fileData);
      res.json(tournaments);
    } else {
      // If file doesn't exist, fetch from API
      const tournaments = await fetchWorldGolfTournaments();
      res.json(tournaments);
    }
  } catch (error) {
    console.error("Error getting tournaments:", error.message);
    res.status(500).json({
      message: "Error retrieving tournaments",
      error: error.message,
    });
  }
});

// Refresh rankings data (protected endpoint)
app.post("/api/refresh-rankings", authenticateToken, async (req, res) => {
  try {
    const rankings = await fetchWorldGolfRankings();
    res.json({
      message: "Rankings refreshed successfully",
      data: rankings,
    });
  } catch (error) {
    console.error("Error refreshing rankings:", error.message);
    res.status(500).json({
      message: "Error refreshing rankings",
      error: error.message,
    });
  }
});

// Refresh tournament data (protected endpoint)
app.post("/api/refresh-tournaments", authenticateToken, async (req, res) => {
  try {
    const tournaments = await fetchWorldGolfTournaments();
    res.json({
      message: "Tournaments refreshed successfully",
      data: tournaments,
    });
  } catch (error) {
    console.error("Error refreshing tournaments:", error.message);
    res.status(500).json({
      message: "Error refreshing tournaments",
      error: error.message,
    });
  }
});

// Refresh all data (protected endpoint)
app.post("/api/refresh-all", authenticateToken, async (req, res) => {
  try {
    const [rankings, tournaments] = await Promise.all([
      fetchWorldGolfRankings(),
      fetchWorldGolfTournaments(),
    ]);

    res.json({
      message: "All data refreshed successfully",
      data: { rankings, tournaments },
    });
  } catch (error) {
    console.error("Error refreshing all data:", error.message);
    res.status(500).json({
      message: "Error refreshing data",
      error: error.message,
    });
  }
});

// =============================================================================
// GENERAL ENDPOINTS
// =============================================================================

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    services: {
      database: "connected",
      golf_api: "configured",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// =============================================================================
// SERVER STARTUP
// =============================================================================

// Initialize data on startup (optional)
async function initializeData() {
  console.log("Checking for existing golf data...");

  // Only fetch if files don't exist and API key is available
  if (API_KEY && API_KEY !== "your-api-key-here") {
    if (!fs.existsSync("world_rankings.json")) {
      try {
        await fetchWorldGolfRankings();
      } catch (error) {
        console.log("Could not fetch initial rankings data:", error.message);
      }
    }

    if (!fs.existsSync("tournament_schedule.json")) {
      try {
        await fetchWorldGolfTournaments();
      } catch (error) {
        console.log("Could not fetch initial tournament data:", error.message);
      }
    }
  } else {
    console.log("No valid API key provided - skipping initial data fetch");
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed");
    }
    process.exit(0);
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Golf Rankings & Authentication Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log("Available endpoints:");
  console.log("  AUTH: POST /api/signup, POST /api/login, GET /api/profile");
  console.log("  GOLF: GET /api/rankings, GET /api/tournaments");
  console.log(
    "  ADMIN: POST /api/refresh-rankings, POST /api/refresh-tournaments"
  );

  // Initialize data
  await initializeData();
});

module.exports = app;
