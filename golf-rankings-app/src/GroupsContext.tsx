// GroupsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  maxMembers: number;
  entryFee: number;
  isPrivate: boolean;
  owner: string;
  createdAt: Date;
}

export interface Member {
  id: string;
  username: string;
  role: "owner" | "member";
  joinedAt: Date;
}

interface GroupsContextType {
  groups: Group[];
  addGroup: (group: Omit<Group, "id" | "createdAt">) => void;
  getGroup: (id: string) => Group | undefined;
  joinGroup: (groupId: string, username: string) => void;
  inviteMember: (groupId: string, username: string) => void;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupsProvider");
  }
  return context;
};

interface GroupsProviderProps {
  children: ReactNode;
}

export const GroupsProvider: React.FC<GroupsProviderProps> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([
    // Initial sample data
    {
      id: "1",
      name: "Weekend Warriors",
      description: "Casual golf betting group for weekend tournaments",
      members: [
        {
          id: "1",
          username: "golfpro123",
          role: "owner",
          joinedAt: new Date("2024-01-15"),
        },
        {
          id: "2",
          username: "weekend_golfer",
          role: "member",
          joinedAt: new Date("2024-01-20"),
        },
        {
          id: "3",
          username: "birdie_hunter",
          role: "member",
          joinedAt: new Date("2024-01-25"),
        },
      ],
      maxMembers: 12,
      entryFee: 25,
      isPrivate: false,
      owner: "golfpro123",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Masters Pool 2025",
      description: "Annual Masters tournament pool with serious players only",
      members: [
        {
          id: "4",
          username: "augusta_fan",
          role: "owner",
          joinedAt: new Date("2024-02-01"),
        },
        {
          id: "5",
          username: "green_jacket",
          role: "member",
          joinedAt: new Date("2024-02-05"),
        },
      ],
      maxMembers: 20,
      entryFee: 50,
      isPrivate: true,
      owner: "augusta_fan",
      createdAt: new Date("2024-02-01"),
    },
  ]);

  const addGroup = (groupData: Omit<Group, "id" | "createdAt">) => {
    const newGroup: Group = {
      ...groupData,
      id: Date.now().toString(),
      createdAt: new Date(),
      members: [
        {
          id: Date.now().toString(),
          username: groupData.owner,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const getGroup = (id: string): Group | undefined => {
    return groups.find((group) => group.id === id);
  };

  const joinGroup = (groupId: string, username: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId && group.members.length < group.maxMembers) {
          const newMember: Member = {
            id: Date.now().toString(),
            username,
            role: "member",
            joinedAt: new Date(),
          };
          return {
            ...group,
            members: [...group.members, newMember],
          };
        }
        return group;
      })
    );
  };

  const inviteMember = (groupId: string, username: string) => {
    // In a real app, this would send an invitation
    // For now, we'll just add them directly
    joinGroup(groupId, username);
  };

  return (
    <GroupsContext.Provider
      value={{
        groups,
        addGroup,
        getGroup,
        joinGroup,
        inviteMember,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};
