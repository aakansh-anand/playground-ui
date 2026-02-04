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
