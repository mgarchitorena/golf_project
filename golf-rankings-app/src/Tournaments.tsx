import React, { useEffect, useState } from "react";
import "./Tournaments.css"; // Assuming you have a CSS file for styling

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading tournaments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error loading tournaments</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="no-tournaments-container">
        <h3>No Open Tournaments Found</h3>
        <p>There are currently no tournaments with "open" status.</p>
      </div>
    );
  }

  return (
    <div className="tournament-page">
      <h1>Open Tournament Schedule</h1>
      <p className="tournaments-count">
        {tournaments.length} open tournament(s) found
      </p>
      <div className="tournaments-grid">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="tournament-card">
            <h2>{tournament.name}</h2>
            <p>Event Type: {tournament.event_type}</p>
            <p>
              Purse: {tournament.purse} {tournament.currency}
            </p>
            <p>Points: {tournament.points}</p>
            <p>Start Date: {tournament.start_date}</p>
            <p>End Date: {tournament.end_date}</p>
            <p>Network: {tournament.network}</p>
            <p>
              Status: <span className="status-open">{tournament.status}</span>
            </p>
            <p>
              Venue: {tournament.venue.name}, {tournament.venue.city},{" "}
              {tournament.venue.state}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentsPage;
