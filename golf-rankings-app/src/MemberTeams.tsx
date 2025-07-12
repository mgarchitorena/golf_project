import React from "react";
import "./MemberTeams.css";

interface Player {
  name: string;
  points: number;
  isHighlighted?: boolean;
}

interface MemberTeam {
  memberName: string;
  players: Player[];
}

const MemberTeams: React.FC = () => {
  // Mock data with real golfer names and formatted points
  const memberTeams: MemberTeam[] = [
    {
      memberName: "golfpro123",
      players: [
        { name: "Rory McIlroy", points: 4200000.0, isHighlighted: true },
        { name: "Bryson DeChambeau", points: 798000.0 },
        { name: "Jon Rahm", points: 336000.0 },
        { name: "Collin Morikawa", points: 336000.0 },
        { name: "Patrick Cantlay", points: 96600.0 },
        { name: "Akshay Bhatia", points: 84000.0 },
        { name: "Russell Henley", points: 0, isHighlighted: true },
        { name: "Brian Harman", points: 96600.0 },
      ],
    },
    {
      memberName: "tiger_fan",
      players: [
        { name: "Scottie Scheffler", points: 3850000.0, isHighlighted: true },
        { name: "Xander Schauffele", points: 920000.0 },
        { name: "Viktor Hovland", points: 445000.0 },
        { name: "Max Homa", points: 290000.0 },
        { name: "Tommy Fleetwood", points: 185000.0 },
        { name: "Cameron Young", points: 125000.0 },
        { name: "Tony Finau", points: 98000.0 },
        { name: "Hideki Matsuyama", points: 87000.0 },
      ],
    },
    {
      memberName: "weekend_golfer",
      players: [
        { name: "Ludvig Aberg", points: 2100000.0, isHighlighted: true },
        { name: "Wyndham Clark", points: 675000.0 },
        { name: "Justin Thomas", points: 425000.0 },
        { name: "Jordan Spieth", points: 315000.0 },
        { name: "Rickie Fowler", points: 198000.0 },
        { name: "Sam Burns", points: 145000.0 },
        { name: "Jason Day", points: 112000.0 },
        { name: "Adam Scott", points: 95000.0 },
      ],
    },
  ];

  const formatPoints = (points: number): string => {
    if (points === 0) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(points);
  };

  const getTotalPoints = (players: Player[]): number => {
    return players.reduce((total, player) => total + player.points, 0);
  };

  return (
    <div className="member-teams-page">
      <h1>Member Teams</h1>
      <div className="teams-list">
        {memberTeams.map((memberTeam, index) => (
          <div key={index} className="member-team">
            <h2>{memberTeam.memberName}'s Team</h2>
            <table className="team-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Player</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {memberTeam.players.map((player, idx) => (
                  <tr
                    key={idx}
                    className={player.isHighlighted ? "highlighted-player" : ""}
                  >
                    <td>
                      <strong>Golfer{idx + 1}</strong>
                    </td>
                    <td
                      className={player.isHighlighted ? "highlighted-name" : ""}
                    >
                      {player.name}
                    </td>
                    <td
                      className={
                        player.isHighlighted && player.points === 0
                          ? "highlighted-points"
                          : ""
                      }
                    >
                      {formatPoints(player.points)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td>
                    <strong>Total Team Points:</strong>
                  </td>
                  <td>
                    <strong>
                      {formatPoints(getTotalPoints(memberTeam.players))}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberTeams;
