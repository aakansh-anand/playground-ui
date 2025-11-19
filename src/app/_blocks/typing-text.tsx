import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export default function TypingText({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.p
      className={cn("block items-center", className)}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.2, delayChildren: delay } },
      }}
    >
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 4 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.22, ease: "easeOut" },
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}
