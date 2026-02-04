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
