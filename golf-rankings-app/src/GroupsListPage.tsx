import React from "react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "./GroupsContext";
import "./GroupsListPage.css";

const GroupsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { groups } = useGroups();

  const handleGroupClick = (groupId: string) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="groups-list-container">
      <h1 className="groups-list-title">Groups List</h1>
      <div className="groups-grid">
        {groups.map((group) => (
          <div
            key={group.id}
            className="group-card"
            onClick={() => handleGroupClick(group.id)}
          >
            <div className="group-card-header">
              <h3 className="group-name">{group.name}</h3>
              <span
                className={`group-privacy ${
                  group.isPrivate ? "private" : "public"
                }`}
              >
                {group.isPrivate ? "Private" : "Public"}
              </span>
            </div>
            <p className="group-description">{group.description}</p>
            <div className="group-stats">
              <div className="group-stat">
                <span className="stat-value">{group.members.length}</span>
                <span className="stat-label">Members</span>
              </div>
              <div className="group-stat">
                <span className="stat-value">${group.entryFee}</span>
                <span className="stat-label">Entry Fee</span>
              </div>
            </div>
            <p className="group-owner">Owner: {group.owner}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsListPage;
