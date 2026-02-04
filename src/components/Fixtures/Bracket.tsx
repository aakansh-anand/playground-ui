"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Team } from "./types";
import { useTournament } from "./useTournament";
import { FixtureCard } from "./FixtureCard";
import { TeamSelector } from "./TeamSelector";
import { ArrowLeft } from "lucide-react";

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
