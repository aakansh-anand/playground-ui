"use client";
import { ModeToggle } from "@/components/theme/mode-toggle";
// import CardsPlay from "./_blocks/cards-play";
// import TypingText from "./_blocks/typing-text";
import TurfOnboarding from "@/components/onboarding/onboarding";

export default function HomePage() {
  return (
    <div className="min-h-dvh px-4">
      <ModeToggle />
      <div className="max-w-md mx-auto">
        <TurfOnboarding />
      </div>
    </div>
  );
}
