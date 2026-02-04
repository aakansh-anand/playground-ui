import React from "react";
import * as animations from "./animations";
import { motion } from "motion/react";
const Background = React.memo(function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        variants={animations.backgroundVariants}
        animate="animate"
        className="absolute -top-[20%] -left-[10%] w-screen h-dvh dark:bg-neutral-900/20 bg-neutral-200/20 rounded-full blur-[100px] mix-blend-screen"
      />
      <motion.div
        variants={animations.backgroundVariants}
        animate="animate"
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] bg-neutral-500/20 rounded-full blur-[100px] mix-blend-screen"
      />
    </div>
  );
});

export default Background;
