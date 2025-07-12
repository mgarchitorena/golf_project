import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewGroupPage.css";

interface Member {
  id: string;
  username: string;
  role: "owner" | "member";
  joinedAt: string;
  points?: number;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  maxMembers: number;
  entryFee: number;
  isPrivate: boolean;
  owner: string;
  createdAt: string;
}

interface ViewGroupPageProps {
  onPickTeams?: () => void;
}

const ViewGroupPage: React.FC<ViewGroupPageProps> = ({ onPickTeams }) => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inviteUsername, setInviteUsername] = useState("");

  // Mock data - in real app, this would come from API based on groupId
  const [group] = useState<Group>({
    id: groupId || "1",
    name: "Weekend Warriors",
    description:
      "Casual golf betting group for weekend tournaments with friends and family. We focus on having fun while adding a little excitement to our golf watching experience.",
    members: [
      {
        id: "1",
        username: "golfpro123",
        role: "owner",
        joinedAt: "2024-01-15",
        points: 1450,
      },
      {
        id: "2",
        username: "tiger_fan",
        role: "member",
        joinedAt: "2024-01-20",
        points: 1320,
      },
      {
        id: "3",
        username: "weekend_golfer",
        role: "member",
        joinedAt: "2024-02-01",
        points: 1180,
      },
      {
        id: "4",
        username: "birdie_hunter",
        role: "member",
        joinedAt: "2024-02-05",
        points: 1050,
      },
      {
        id: "5",
        username: "fairway_finder",
        role: "member",
        joinedAt: "2024-02-10",
        points: 980,
      },
    ],
    maxMembers: 12,
    entryFee: 25,
    isPrivate: false,
    owner: "golfpro123",
    createdAt: "2024-01-15",
  });

  const [isOwner] = useState(true); // In real app, check if current user is owner
  const totalPrize = group.members.length * group.entryFee;

  const handleInvite = () => {
    if (inviteUsername.trim()) {
      alert(`Invitation sent to ${inviteUsername}!`);
      setInviteUsername("");
    }
  };

  const handlePickTeams = () => {
    if (onPickTeams) {
      onPickTeams();
    } else {
      navigate(`/pick-teams/${groupId}`);
    }
  };

  const handleViewMemberTeams = () => {
    navigate("/memberteams"); // Navigate to the MemberTeams page
  };

  const handleBack = () => {
    navigate("/groups");
  };

  return (
    <div className="view-group-container">
      <button onClick={handleBack} className="back-button">
        {/* <ArrowLeft size={20} /> */}
        Back to Groups
      </button>

      <div className="group-header">
        <h1 className="group-title">{group.name}</h1>
        <p className="group-description">{group.description}</p>

        <div className="group-info-grid">
          <div className="group-info-item">
            <span className="info-value">
              {group.members.length}/{group.maxMembers}
            </span>
            <span className="info-label">Members</span>
          </div>
          <div className="group-info-item">
            <span className="info-value">${group.entryFee}</span>
            <span className="info-label">Entry Fee</span>
          </div>
          <div className="group-info-item">
            <span className="info-value">${totalPrize}</span>
            <span className="info-label">Total Prize</span>
          </div>
          <div className="group-info-item">
            <span className="info-value">
              {group.isPrivate ? "Private" : "Public"}
            </span>
            <span className="info-label">Type</span>
          </div>
        </div>

        <div className="main-actions">
          <button onClick={handlePickTeams} className="btn-primary-large">
            Pick Your Teams
          </button>
          <button
            onClick={handleViewMemberTeams}
            className="btn-secondary-large"
          >
            View Member Teams
          </button>
        </div>
      </div>

      <div className="members-section" id="members">
        <h2 className="section-title">
          Group Members ({group.members.length})
        </h2>
        <div className="members-grid">
          {group.members.map((member) => (
            <div key={member.id} className="member-card">
              <div className="member-info">
                <div className="member-avatar">
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <div className="member-details">
                  <h4>{member.username}</h4>
                  <p className="member-role">
                    {member.role === "owner" ? "👑 Owner" : "Member"}
                    {member.points && ` • ${member.points} pts`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOwner && (
        <div className="invite-section">
          <h3 className="invite-title">
            {/* <UserPlus size={20} /> */}
            Invite New Members
          </h3>
          <div className="invite-form">
            <input
              type="text"
              placeholder="Enter username"
              value={inviteUsername}
              onChange={(e) => setInviteUsername(e.target.value)}
              className="invite-input"
            />
            <button onClick={handleInvite} className="btn-invite">
              Send Invite
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewGroupPage;
