import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as icons from "./icons";
import * as animations from "./animations";
import Image from "next/image";

type SportId =
  | "football"
  | "cricket"
  | "basketball"
  | "tennis"
  | "badminton"
  | "volleyball"
  | "swimming"
  | "gym";

type Sport = {
  id: SportId;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

type FormData = {
  placeName: string;
  address: string;
  sports: SportId[];
  images: File[];
  latitude?: number;
  longitude?: number;
  locationUrl?: string;
};

const sports: Sport[] = [
  { id: "football", name: "Football", icon: icons.Circle },
  { id: "cricket", name: "Cricket", icon: icons.Target },
  { id: "basketball", name: "Basketball", icon: icons.Disc },
  { id: "tennis", name: "Tennis", icon: icons.TrendingUp },
  { id: "badminton", name: "Badminton", icon: icons.Zap },
  { id: "volleyball", name: "Volleyball", icon: icons.Circle },
  { id: "swimming", name: "Swimming", icon: icons.Waves },
  { id: "gym", name: "Gym", icon: icons.Dumbbell },
];

export default function TurfOnboarding() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    placeName: "",
    address: "",
    sports: [],
    images: [],
    locationUrl: "",
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLocating(false);
      }
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      console.log("Form submitted:", formData);
      alert("Onboarding complete! Check console for data.");
    }
  };

  const handleSportToggle = (sportId: SportId) => {
    setFormData((prev) => ({
      ...prev,
      sports: prev.sports.includes(sportId)
        ? prev.sports.filter((s: string) => s !== sportId)
        : [...prev.sports, sportId],
    }));
  };

  const isStepValid = () => {
    if (step === 1) return formData.placeName.trim().length > 0;
    if (step === 2) return formData.address.trim().length > 0;
    if (step === 2) return formData.address.trim().length > 0;
    if (step === 3) return formData.sports.length > 0;
    if (step === 4) return formData.images.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Dynamic Background */}
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

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 z-10 border-2 ${
                    step >= i
                      ? "bg-[#ADFA1D] text-black border-[#ADFA1D] shadow-[0_0_20px_rgba(173,250,29,0.4)]"
                      : "bg-neutral-900 text-neutral-500 border-neutral-800"
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step > i ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      ✓
                    </motion.div>
                  ) : (
                    i
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

        {/* Form Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={animations.containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <motion.div variants={animations.itemVariants}>
                <h1 className="text-5xl sm:text-6xl font-bold mb-3 tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
                  Welcome! 👋
                </h1>
                <p className="text-neutral-400 text-xl">
                  Let&apos;s start by naming your turf
                </p>
              </motion.div>

              <motion.div variants={animations.itemVariants}>
                <label className="block text-sm font-medium mb-2 text-neutral-300 uppercase tracking-wider">
                  Turf Name
                </label>
                <div className="relative group">
                  <icons.MapPin
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 group-focus-within:text-[#ADFA1D] transition-colors"
                    size={20}
                  />
                  <motion.input
                    type="text"
                    value={formData.placeName}
                    onChange={(e) =>
                      setFormData({ ...formData, placeName: e.target.value })
                    }
                    className="w-full bg-neutral-900/50 backdrop-blur-sm border-2 border-neutral-800 rounded-2xl py-5 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ADFA1D] focus:ring-4 focus:ring-[#ADFA1D]/10 transition-all text-lg shadow-lg"
                    placeholder="e.g., Champions Sports Arena"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={animations.containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <motion.div variants={animations.itemVariants}>
                <h1 className="text-4xl sm:text-5xl font-bold mb-3 flex gap-3">
                  <span className="tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
                    Location
                  </span>
                  <span>📍</span>
                </h1>
                <p className="text-neutral-400 text-xl">
                  Where is your turf located?
                </p>
              </motion.div>

              <motion.div variants={animations.itemVariants}>
                <label className="block text-sm font-medium mb-2 text-neutral-300 uppercase tracking-wider flex justify-between items-center">
                  <span>Full Address</span>
                  <button
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="text-[#ADFA1D] text-xs flex items-center gap-1 hover:underline disabled:opacity-50"
                  >
                    <icons.Locate size={14} />
                    {isLocating ? "Locating..." : "Use Current Location"}
                  </button>
                </label>
                <div className="relative group">
                  <icons.Navigation
                    className="absolute left-4 top-6 text-neutral-500 group-focus-within:text-[#ADFA1D] transition-colors"
                    size={20}
                  />
                  <motion.textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full bg-neutral-900/50 backdrop-blur-sm border-2 border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ADFA1D] focus:ring-4 focus:ring-[#ADFA1D]/10 transition-all text-lg shadow-lg resize-none"
                    placeholder="Street, City, State, PIN"
                    rows={4}
                    whileFocus={{ scale: 1.01 }}
                  />
                  {formData.latitude && formData.longitude && (
                    <div className="absolute bottom-3 right-3 text-xs text-[#ADFA1D] bg-[#ADFA1D]/10 px-2 py-1 rounded-full border border-[#ADFA1D]/20">
                      Location Attached ✓
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={animations.itemVariants}>
                <label className="block text-sm font-medium mb-2 text-neutral-300 uppercase tracking-wider">
                  Location URL{" "}
                  <span className="text-neutral-500 normal-case">
                    (Optional)
                  </span>
                </label>
                <div className="relative group">
                  <icons.Link
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 group-focus-within:text-[#ADFA1D] transition-colors"
                    size={20}
                  />
                  <motion.input
                    type="url"
                    value={formData.locationUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, locationUrl: e.target.value })
                    }
                    className="w-full bg-neutral-900/50 backdrop-blur-sm border-2 border-neutral-800 rounded-2xl py-5 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ADFA1D] focus:ring-4 focus:ring-[#ADFA1D]/10 transition-all text-lg shadow-lg"
                    placeholder="https://maps.google.com/..."
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={animations.containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <motion.div variants={animations.itemVariants}>
                <h1 className="text-4xl sm:text-5xl font-bold mb-3 flex items-center gap-3">
                  <span className="tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
                    Almost done!
                  </span>{" "}
                  <span>⚽</span>
                </h1>
                <p className="text-neutral-400 text-xl">
                  What sports do you offer?
                </p>
              </motion.div>

              <motion.div
                variants={animations.itemVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {sports.map((sport) => {
                  const Icon = sport.icon;
                  const isSelected = formData.sports.includes(sport.id);
                  return (
                    <motion.button
                      key={sport.id}
                      onClick={() => handleSportToggle(sport.id)}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group ${
                        isSelected
                          ? "border-[#ADFA1D] bg-[#ADFA1D]/10 shadow-[0_0_30px_rgba(173,250,29,0.15)]"
                          : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-600 hover:bg-neutral-800/50"
                      }`}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{
                          color: isSelected ? "#ADFA1D" : "#737373",
                        }}
                        className="flex flex-col items-center gap-3"
                      >
                        <Icon
                          size={32}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className="text-sm font-semibold tracking-wide">
                          {sport.name}
                        </span>
                      </motion.div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-2 h-2 bg-[#ADFA1D] rounded-full shadow-[0_0_10px_#ADFA1D]"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={animations.containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <motion.div variants={animations.itemVariants}>
                <h1 className="text-4xl sm:text-5xl font-bold mb-3 flex gap-2 items-center">
                  <span className="tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
                    Show it off!
                  </span>
                  <span>📸</span>
                </h1>

                <p className="text-neutral-400 text-xl">
                  Add some photos of your venue
                </p>
              </motion.div>

              <motion.div variants={animations.itemVariants}>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-[#ADFA1D] bg-[#ADFA1D]/10 scale-[1.02]"
                      : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-[#ADFA1D]"
                      initial={{
                        scale: 1,
                        rotate: 0,
                      }}
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 10, 0],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }}
                    >
                      <icons.Upload size={32} />
                    </motion.div>
                    <div>
                      <p className="text-lg font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-neutral-500 text-sm">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                    </div>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6"
                  >
                    <AnimatePresence>
                      {formData.images.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          layout
                          className="relative aspect-video rounded-xl overflow-hidden group"
                        >
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 rounded-full text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <icons.X size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          className="flex gap-4 mt-12 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {step > 1 && (
            <motion.button
              onClick={() => setStep(step - 1)}
              className="px-8 py-4 rounded-xl border-2 border-neutral-800 text-white font-bold hover:border-neutral-600 hover:bg-neutral-800 transition-all"
              whileHover={{ scale: 1.02, x: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
          )}

          <motion.button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex-1 py-4 rounded-xl font-bold text-lg tracking-wide transition-all shadow-lg ${
              isStepValid()
                ? "bg-[#ADFA1D] text-black hover:bg-[#9DE018] shadow-[0_0_30px_rgba(173,250,29,0.3)]"
                : "bg-neutral-900 text-neutral-600 cursor-not-allowed border-2 border-neutral-800"
            }`}
            whileHover={isStepValid() ? { scale: 1.02 } : {}}
            whileTap={isStepValid() ? { scale: 0.98 } : {}}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {step === 4 ? "Complete Setup" : "Continue"}
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <icons.ArrowRight size={20} />
              </motion.div>
            </span>
            {isStepValid() && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
