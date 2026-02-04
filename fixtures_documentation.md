# Fixtures UI and Logic Documentation

This file contains the complete structure, logic, and code for the Fixtures/Tournament Bracket feature.

## Directory Structure

The feature is primarily contained within `src/components/Fixtures/`, with integration in `src/app/page.tsx`.

```
src/
├── app/
│   └── page.tsx
└── components/
    └── Fixtures/
        ├── Bracket.tsx       # Main container, switches between Setup and Bracket views
        ├── FixtureCard.tsx   # Displays individual match details
        ├── TeamSelector.tsx  # Setup screen: add teams, pairing logic
        ├── useTournament.ts  # Hook: Bracket generation algorithms
        └── types.ts          # TypeScript interfaces
```

---

## 1. Types (`src/components/Fixtures/types.ts`)

Defines the core data structures: `Team`, `Match`, and `Round`.

```typescript
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
```

---

## 2. Core Logic Hook (`src/components/Fixtures/useTournament.ts`)

Handles the algorithmic generation of the bracket rounds based on the initial team list. It manages byes and round progression.

```typescript
import { useState, useCallback } from "react";
import { Team, Round, Match } from "./types";

export const useTournament = () => {
  const [rounds, setRounds] = useState<Round[]>([]);

  const generateBracket = useCallback((teams: Team[]) => {
    const generatedRounds: Round[] = [];
    let currentRoundTeams = [...teams];
    let roundIndex = 0;

    while (currentRoundTeams.length > 1) {
      const matches: Match[] = [];
      const nextRoundTeams: Team[] = [];

      const teamsToPair = [...currentRoundTeams];
      const isByeAtStart = roundIndex % 2 !== 0; // Alternate bye position (R2, R4...)

      // Handle Bye at Start
      if (isByeAtStart && teamsToPair.length % 2 !== 0) {
        const byeTeam = teamsToPair.shift();
        if (byeTeam) {
          matches.push({
            id: `R${roundIndex}-M${matches.length}`,
            team1: byeTeam,
            team2: null,
            winner: byeTeam,
            roundIndex,
            matchIndex: matches.length,
            isBye: true,
          });
          nextRoundTeams.push(byeTeam);
        }
      }

      // Pair the rest
      for (let i = 0; i < teamsToPair.length; i += 2) {
        const team1 = teamsToPair[i];
        const team2 = teamsToPair[i + 1] || null;

        if (team2) {
          // Normal match
          matches.push({
            id: `R${roundIndex}-M${matches.length}`,
            team1,
            team2,
            winner: null,
            roundIndex,
            matchIndex: matches.length,
            isBye: false,
          });
          nextRoundTeams.push({
            id: `winner-R${roundIndex}-M${matches.length}`,
            name: "TBD",
            shortName: "TBD",
            color: "#ccc",
          });
        } else {
          // Bye - team1 advances automatically (Bye at End)
          matches.push({
            id: `R${roundIndex}-M${matches.length}`,
            team1,
            team2: null,
            winner: team1,
            roundIndex,
            matchIndex: matches.length,
            isBye: true,
          });
          nextRoundTeams.push(team1);
        }
      }

      generatedRounds.push({
        index: roundIndex,
        matches,
      });

      currentRoundTeams = nextRoundTeams;
      roundIndex++;
    }

    setRounds(generatedRounds);
  }, []);

  return {
    rounds,
    generateBracket,
  };
};
```

---

## 3. Main Component (`src/components/Fixtures/Bracket.tsx`)

This is the entry point. It manages the state between "Setup" (selecting teams) and "Bracket" (viewing matches). It uses `useTournament` to generate the rounds.

```typescript
"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Team } from "./types";
import { useTournament } from "./useTournament";
import { FixtureCard } from "./FixtureCard";
import { TeamSelector } from "./TeamSelector";
import { ArrowLeft } from "lucide-react";

/**
 * Predefined teams for easy demo/testing
 */
const IPL_TEAMS: Team[] = [
  {
    id: "csk",
    name: "JCERC",
    shortName: "CSK",
    color: "#FFFF00",
  },
  { id: "mi", name: "MIT", shortName: "MI", color: "#004BA0" },
  {
    id: "rcb",
    name: "GIT",
    shortName: "RCB",
    color: "#EC1C24",
  },
  {
    id: "kkr",
    name: "SKIT",
    shortName: "KKR",
    color: "#3A225D",
  },
  {
    id: "srh",
    name: "RU",
    shortName: "SRH",
    color: "#F7A721",
  },
  { id: "dc", name: "Purnima", shortName: "DC", color: "#00008B" },
  { id: "pbks", name: "MDSU", shortName: "PBKS", color: "#DD1F2D" },
  { id: "rr", name: "Arya", shortName: "RR", color: "#EA1A85" },
  {
    id: "lsg",
    name: "Manipal",
    shortName: "LSG",
    color: "#A0CEF8",
  },
];

export const Bracket: React.FC = () => {
  const { rounds, generateBracket } = useTournament();
  const [view, setView] = useState<"setup" | "bracket">("setup");

  const handleStart = (teams: Team[]) => {
    generateBracket(teams);
    setView("bracket");
  };

  if (view === "setup") {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <TeamSelector initialTeams={IPL_TEAMS} onStart={handleStart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 border-b flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setView("setup")}
          className="p-2 hover:bg-muted rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="text-lg font-bold">Tournament Bracket</h1>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
        <div className="flex gap-12 min-w-max h-full">
          {rounds.map((round, rIndex) => (
            <motion.div
              key={round.index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: rIndex * 0.1,
                duration: 0.4,
                ease: "easeOut",
              }}
              className="flex flex-col gap-8 justify-center relative"
            >
              <div className="absolute -top-8 left-0 w-full text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {rIndex === rounds.length - 1
                  ? "Winner"
                  : `Round ${rIndex + 1}`}
              </div>

              {round.matches.map((match, mIndex) => (
                <div key={match.id} className="relative flex items-center">
                  <FixtureCard match={match} index={mIndex} />

                  {/* Connector Lines */}
                  {rIndex < rounds.length - 1 && (
                    <>
                      {/* Horizontal line to next round */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        style={{ originX: 0 }}
                        transition={{
                          delay: rIndex * 0.1 + 0.2,
                          duration: 0.3,
                        }}
                        className="absolute -right-6 top-1/2 w-6 h-px bg-border"
                      />
                    </>
                  )}
                </div>
              ))}
            </motion.div>
          ))}

          {/* Winner Slot (Visual only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: rounds.length * 0.1 + 0.2,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="flex flex-col justify-center gap-8"
          >
            <div className="absolute -top-8 left-0 w-full text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Champion
            </div>
            <div className="w-48 h-24 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground font-bold">
              ?
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
```

---

## 4. Setup Wrapper (`src/components/Fixtures/TeamSelector.tsx`)

Handles the UI for adding/removing teams and creating initial manual pairings before match generation.

```typescript
"use client";
import React, { useState, useMemo } from "react";
import { Team } from "./types";
import { X, Plus, Users, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TeamSelectorProps {
  initialTeams: Team[];
  onStart: (teams: Team[]) => void;
}

interface MatchPair {
  id: string;
  team1: Team;
  team2: Team;
}

const generateId = (prefix: string = "") => {
  return `${prefix}${Math.random().toString(36).substr(2, 9)}`;
};

export const TeamSelector: React.FC<TeamSelectorProps> = ({
  initialTeams,
  onStart,
}) => {
  const [allTeams, setAllTeams] = useState<Team[]>(initialTeams);
  const [matches, setMatches] = useState<MatchPair[]>([]);

  // Teams that are not in any match
  const availableTeams = useMemo(() => {
    const matchedIds = new Set(
      matches.flatMap((m) => [m.team1.id, m.team2.id])
    );
    return allTeams.filter((t) => !matchedIds.has(t.id));
  }, [allTeams, matches]);

  const [selectedTeamForPairing, setSelectedTeamForPairing] =
    useState<Team | null>(null);

  const handleTeamClick = (team: Team) => {
    setSelectedTeamForPairing(team);
  };

  const handleOpponentSelect = (opponent: Team) => {
    if (!selectedTeamForPairing) return;

    const newMatch: MatchPair = {
      id: generateId("setup-match-"),
      team1: selectedTeamForPairing,
      team2: opponent,
    };

    setMatches([...matches, newMatch]);
    setSelectedTeamForPairing(null);
  };

  const breakMatch = (matchId: string) => {
    setMatches(matches.filter((m) => m.id !== matchId));
  };

  const addTeam = () => {
    const newTeam: Team = {
      id: generateId("new-"),
      name: `Team ${allTeams.length + 1}`,
      shortName: `T${allTeams.length + 1}`,
      color: "#000",
    };
    setAllTeams([...allTeams, newTeam]);
  };

  const removeTeam = (id: string) => {
    // If team is in a match, remove the match first
    setMatches(matches.filter((m) => m.team1.id !== id && m.team2.id !== id));
    setAllTeams(allTeams.filter((t) => t.id !== id));
  };

  const handleStart = () => {
    // Construct the ordered list: [M1T1, M1T2, M2T1, M2T2, ... UnpairedTeams]
    const orderedTeams: Team[] = [];
    matches.forEach((m) => {
      orderedTeams.push(m.team1);
      orderedTeams.push(m.team2);
    });
    // Add remaining available teams (the bye team(s))
    orderedTeams.push(...availableTeams);

    onStart(orderedTeams);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tournament Setup</h2>
          <p className="text-muted-foreground">
            Pair teams to create fixtures. Leftover team gets a bye.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTeam}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-medium"
        >
          <Plus className="w-4 h-4" /> Add Team
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Matches Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Confirmed Fixtures
          </h3>
          <div className="space-y-3 min-h-[200px] p-4 bg-muted/30 rounded-xl border border-dashed">
            <AnimatePresence mode="popLayout">
              {matches.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-8"
                >
                  No matches set yet. Select a team to start pairing.
                </motion.div>
              )}
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  }}
                  className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-xs font-mono text-muted-foreground w-6">
                      M{index + 1}
                    </span>
                    <div className="flex-1 font-medium text-right">
                      {match.team1.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-bold">
                      VS
                    </div>
                    <div className="flex-1 font-medium">{match.team2.name}</div>
                  </div>
                  <button
                    onClick={() => breakMatch(match.id)}
                    className="ml-4 p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Available Teams Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Available Teams ({availableTeams.length})
          </h3>
          <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto p-1">
            <AnimatePresence mode="popLayout" initial={false}>
              {availableTeams.map((team) => (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 1,
                  }}
                  className="group relative flex gap-4"
                >
                  <button
                    onClick={() => handleTeamClick(team)}
                    className="w-full flex items-center justify-between p-3 bg-card border rounded-lg hover:border-primary hover:shadow-md transition-all text-left cursor-pointer"
                  >
                    <span className="font-medium">{team.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full transition-colors">
                      Select
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTeam(team.id);
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive transition-opacity bg-accent rounded-lg border"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          disabled={matches.length === 0 && availableTeams.length > 1} // Encourage at least one match? Or just let them proceed.
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Bracket
          {availableTeams.length > 0 && (
            <span className="block text-xs font-normal opacity-80 mt-1">
              {availableTeams.length} team{availableTeams.length > 1 ? "s" : ""}{" "}
              will get a Bye
            </span>
          )}
        </motion.button>
      </div>

      {/* Opponent Selection Modal */}
      <AnimatePresence>
        {selectedTeamForPairing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-background w-full max-w-md rounded-xl shadow-2xl border overflow-hidden"
            >
              <div className="p-4 border-b flex items-center justify-between bg-muted/50">
                <h3 className="font-bold">
                  Select Opponent for{" "}
                  <span className="text-primary">
                    {selectedTeamForPairing.name}
                  </span>
                </h3>
                <button
                  onClick={() => setSelectedTeamForPairing(null)}
                  className="p-1 hover:bg-muted rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2 max-h-[50vh] overflow-y-auto">
                {availableTeams.filter(
                  (t) => t.id !== selectedTeamForPairing.id
                ).length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No other teams available.
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {availableTeams
                      .filter((t) => t.id !== selectedTeamForPairing.id)
                      .map((opponent) => (
                        <button
                          key={opponent.id}
                          onClick={() => handleOpponentSelect(opponent)}
                          className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors text-left group"
                        >
                          <span className="font-medium">{opponent.name}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            VS
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

---

## 5. UI Component (`src/components/Fixtures/FixtureCard.tsx`)

Displays an individual match card, handling the "VS" text or "Bye" status and showing the result.

```typescript
"use client";
import React from "react";
import { motion } from "motion/react";
import { Match } from "./types";
import { cn } from "@/lib/utils";

interface FixtureCardProps {
  match: Match;
  className?: string;
  index?: number;
}

export const FixtureCard: React.FC<FixtureCardProps> = ({
  match,
  className,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        "flex flex-col border rounded-lg bg-card text-card-foreground shadow-sm w-48 shrink-0 transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="p-3 space-y-2">
        <div className="text-xs text-muted-foreground font-mono mb-1">
          Match {match.matchIndex + 1} {match.isBye && "(Bye)"}
        </div>

        {/* Team 1 */}
        <div
          className={cn(
            "flex items-center justify-between p-2 rounded",
            match.winner?.id === match.team1?.id
              ? "bg-green-500/10 font-bold"
              : "bg-muted/50"
          )}
        >
          <span className="truncate">{match.team1?.name || "TBD"}</span>
        </div>

        {/* VS or Bye */}
        {!match.isBye && (
          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <span className="relative bg-card px-2 text-xs text-muted-foreground">
              VS
            </span>
          </div>
        )}

        {/* Team 2 */}
        {!match.isBye && (
          <div
            className={cn(
              "flex items-center justify-between p-2 rounded",
              match.winner?.id === match.team2?.id
                ? "bg-green-500/10 font-bold"
                : "bg-muted/50"
            )}
          >
            <span className="truncate">{match.team2?.name || "TBD"}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
```

---

## 6. Page Integration (`src/app/page.tsx`)

Simple wrapper page that renders the `Bracket` component.

```typescript
import { Bracket } from "@/components/Fixtures/Bracket";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Bracket />
    </main>
  );
}
```
