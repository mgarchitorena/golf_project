import React, { useEffect, useState } from "react";
import "./Tournaments.css";

interface Tournament {
  id: string;
  name: string;
  event_type: string;
  purse: number;
  currency: string;
  points: number;
  start_date: string;
  end_date: string;
  course_timezone: string;
  network: string;
  total_rounds: number;
  status: string;
  parent_id: string;
  scoring_system: string;
  venue: {
    id: string;
    name: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    latitude: string;
    longitude: string;
  };
}

interface TournamentSchedule {
  tour: {
    id: string;
    alias: string;
    name: string;
  };
  season: {
    id: string;
    year: number;
  };
  tournaments: Tournament[];
}

const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch("/tournament_schedule.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: TournamentSchedule = await response.json();
        // Filter tournaments to only show those with "open" status
        const openTournaments = data.tournaments.filter(
          (tournament) => tournament.status.toLowerCase() === "scheduled"
        );
        setTournaments(openTournaments);
        setFilteredTournaments(openTournaments);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    let filtered = tournaments.filter(
      (tournament) =>
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.venue.city
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tournament.venue.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort tournaments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          );
        case "purse":
          return b.purse - a.purse;
        case "points":
          return b.points - a.points;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredTournaments(filtered);
  }, [searchTerm, sortBy, tournaments]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString("en-US", {
        month: "short",
      })} ${start.getDate()} - ${end.getDate()}`;
    } else {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  };

  if (loading) {
    return (
      <div className="tournaments-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tournaments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tournaments-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error loading tournaments</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="tournaments-page">
        <div className="no-tournaments">
          <div className="no-tournaments-icon">🏌️</div>
          <h3>No Open Tournaments Found</h3>
          <p>There are currently no tournaments with "open" status.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tournaments-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Tournament Schedule</h1>
          <p className="subtitle">
            {filteredTournaments.length} open tournament
            {filteredTournaments.length !== 1 ? "s" : ""} available
          </p>

          {/* Controls */}
          <div className="controls">
            {/* Search */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search tournaments, cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            {/* Sort */}
            <div className="sort-container">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">Sort by Date</option>
                <option value="purse">Sort by Purse</option>
                <option value="points">Sort by Points</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Grid */}
      <div className="tournaments-grid">
        {filteredTournaments.map((tournament) => (
          <div key={tournament.id} className="tournament-card">
            {/* Tournament Header */}
            <div className="card-header">
              <h2 className="tournament-name">{tournament.name}</h2>
              <div className="status-badge">OPEN</div>
            </div>

            {/* Tournament Details */}
            <div className="tournament-details">
              <div className="detail-row">
                <span className="detail-label">Dates</span>
                <span className="detail-value">
                  {getDateRange(tournament.start_date, tournament.end_date)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Purse</span>
                <span className="detail-value purse">
                  {formatCurrency(tournament.purse, tournament.currency)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Points</span>
                <span className="detail-value points">{tournament.points}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Event Type</span>
                <span className="detail-value">{tournament.event_type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Rounds</span>
                <span className="detail-value">{tournament.total_rounds}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Network</span>
                <span className="detail-value">{tournament.network}</span>
              </div>
            </div>

            {/* Venue Info */}
            <div className="venue-info">
              <div className="venue-header">Venue</div>
              <div className="venue-name">{tournament.venue.name}</div>
              <div className="venue-location">
                {tournament.venue.city}, {tournament.venue.state}{" "}
                {tournament.venue.zipcode}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentsPage;
