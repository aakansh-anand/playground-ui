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
  // We keep track of all teams, but we manage them as "paired" or "unpaired"
  // Actually, to make it easy, let's track "matches" and "availableTeams" derived from a master list?
  // Or just track matches and a list of free teams.

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
