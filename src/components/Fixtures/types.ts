export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface Match {
  id: string;
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
  roundIndex: number;
  matchIndex: number;
  isBye?: boolean; // If true, team1 automatically advances
}

export interface Round {
  index: number;
  matches: Match[];
}
