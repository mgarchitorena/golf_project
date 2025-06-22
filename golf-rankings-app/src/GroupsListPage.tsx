// #src/GroupsListPage.tsx

import React from "react";
// import { Navigate } from "react-router-dom";

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  entryFee: number;
  isPrivate: boolean;
  owner: string;
}

const GroupsListPage: React.FC = () => {
  // Mock data
  const myGroups: Group[] = [
    {
      id: "1",
      name: "Weekend Warriors",
      description: "Casual golf betting group for weekend tournaments",
      members: 8,
      maxMembers: 12,
      entryFee: 25,
      isPrivate: false,
      owner: "golfpro123",
    },
    {
      id: "2",
      name: "Masters Pool 2025",
      description: "Annual Masters tournament pool",
      members: 15,
      maxMembers: 20,
      entryFee: 50,
      isPrivate: true,
      owner: "augusta_fan",
    },
  ];

  const allGroups: Group[] = [
    ...myGroups,
    {
      id: "3",
      name: "Pro Golfers Club",
      description: "Elite group for professional golfers",
      members: 5,
      maxMembers: 10,
      entryFee: 100,
      isPrivate: true,
      owner: "pro_golfer",
    },
    {
      id: "4",
      name: "Open Golf League",
      description: "Public league for all golf enthusiasts",
      members: 20,
      maxMembers: 30,
      entryFee: 10,
      isPrivate: false,
      owner: "open_league_admin",
    },
  ];

  return (
    <div>
      <h1>Groups List</h1>
      <section>
        <h2>My Groups</h2>
        <ul>
          {myGroups.map((group) => (
            <li key={group.id}>
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <p>
                Members: {group.members}/{group.maxMembers}
              </p>
              <p>Entry Fee: ${group.entryFee}</p>
              <p>Owner: {group.owner}</p>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>All Groups</h2>
        <ul>
          {allGroups.map((group) => (
            <li key={group.id}>
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <p>
                Members: {group.members}/{group.maxMembers}
              </p>
              <p>Entry Fee: ${group.entryFee}</p>
              <p>Owner: {group.owner}</p>
              <button>
                {group.isPrivate ? "Request to Join" : "Join Group"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default GroupsListPage;
