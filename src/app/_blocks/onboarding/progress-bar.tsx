import { motion } from "motion/react";
export default function ProgressBar({ step }: { step: number }) {
  const noOfSteps = 4;
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-2">
        {Array.from({ length: noOfSteps }).map((_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 z-10 border-2 ${
                step >= i + 1
                  ? "bg-[#ADFA1D] text-black border-[#ADFA1D] shadow-[0_0_20px_rgba(173,250,29,0.4)]"
                  : "bg-neutral-900 text-neutral-500 border-neutral-800"
              }`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {step > i + 1 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  ✓
                </motion.div>
              ) : (
                i + 1
              )}
            </motion.div>
            {i < 4 && (
              <div className="flex-1 h-1 mx-2 bg-neutral-900 rounded-full overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-[#ADFA1D]"
                  initial={{ x: "-100%" }}
                  animate={{ x: step > i ? "0%" : "-100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
