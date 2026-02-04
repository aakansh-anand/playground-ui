import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as icons from "./icons";
import Background from "./background";
import ProgressBar from "./progress-bar";
import { FormData, SportId, GroundData } from "./types";
import {
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  MultipleGroundsStep,
  GroundNameStep,
  GroundSportsStep,
  GroundImagesStep,
  GroundPricingStep,
} from "./steps";

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

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Ground Flow State
  const [flow, setFlow] = useState<"venue" | "ground">("venue");
  const [savedGrounds, setSavedGrounds] = useState<GroundData[]>([]);
  const [currentGround, setCurrentGround] = useState<GroundData>({
    id: "",
    name: "",
    sports: [],
    imageIndices: [],
    price: "",
    hasHalfGround: false,
    halfGroundPrice: "",
  });
  const [isSingleGround, setIsSingleGround] = useState(false);

  const handleNext = () => {
    if (flow === "venue") {
      if (step < 4) setStep(step + 1);
      else setShowSuccessModal(true);
    } else {
      // Ground Flow Navigation
      if (step === 1) {
        // Multiple grounds check - always go to step 2 (Name)
        setStep(2);
      } else if (step < 5) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddGroundStart = () => {
    setShowSuccessModal(false);
    setFlow("ground");
    setStep(1);
    setIsSingleGround(false);
    // Initialize first ground
    setCurrentGround({
      id: crypto.randomUUID(),
      name: "",
      sports: [],
      imageIndices: [],
      price: "",
      hasHalfGround: false,
      halfGroundPrice: "",
    });
  };

  const handleSaveGround = () => {
    setSavedGrounds((prev) => [...prev, currentGround]);
  };

  const handleAddAnotherGround = () => {
    handleSaveGround();
    // Reset for next ground
    setCurrentGround({
      id: crypto.randomUUID(),
      name: "",
      sports: [],
      imageIndices: [],
      price: "",
      hasHalfGround: false,
      halfGroundPrice: "",
    });
    setStep(2); // Go back to Name step
  };

  const handleGroundDone = () => {
    const allGrounds = [...savedGrounds, currentGround];
    console.log("FINAL SUBMISSION:", {
      venue: formData,
      grounds: allGrounds,
    });
    alert("All Set! Check console for final data.");
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
    if (flow === "venue") {
      if (step === 1) return formData.placeName.trim().length > 0;
      if (step === 2) return formData.address.trim().length > 0;
      if (step === 3) return formData.sports.length > 0;
      if (step === 4) return formData.images.length > 0;
    } else {
      // Ground Flow Validation
      if (step === 1) return true; // Yes/No buttons handle nav
      if (step === 2) return true; // Name is optional
      if (step === 3) return currentGround.sports.length > 0;
      if (step === 4) return currentGround.imageIndices.length > 0;
      if (step === 5)
        return (
          currentGround.price &&
          (!currentGround.hasHalfGround || currentGround.halfGroundPrice)
        );
    }
    return false;
  };

  // Render Helpers
  const renderVenueSteps = () => (
    <AnimatePresence mode="wait">
      {step === 1 && <StepOne formData={formData} setFormData={setFormData} />}
      {step === 2 && <StepTwo formData={formData} setFormData={setFormData} />}
      {step === 3 && (
        <StepThree formData={formData} handleSportToggle={handleSportToggle} />
      )}
      {step === 4 && (
        <StepFour
          formData={formData}
          isDragging={isDragging}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleFileSelect={handleFileSelect}
          removeImage={removeImage}
        />
      )}
    </AnimatePresence>
  );

  const renderGroundSteps = () => (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <MultipleGroundsStep
          onYes={() => setStep(2)}
          onNo={() => {
            setIsSingleGround(true);
            setCurrentGround((prev) => ({
              ...prev,
              name: "Main Ground",
              sports: formData.sports,
              imageIndices: formData.images.map((_, i) => i),
            }));
            setStep(5);
          }}
        />
      )}
      {step === 2 && (
        <GroundNameStep
          name={currentGround.name}
          setName={(name) => setCurrentGround({ ...currentGround, name })}
        />
      )}
      {step === 3 && (
        <GroundSportsStep
          availableSports={formData.sports}
          selectedSports={currentGround.sports}
          toggleSport={(sportId) => {
            setCurrentGround((prev) => ({
              ...prev,
              sports: prev.sports.includes(sportId)
                ? prev.sports.filter((s) => s !== sportId)
                : [...prev.sports, sportId],
            }));
          }}
        />
      )}
      {step === 4 && (
        <GroundImagesStep
          allImages={formData.images}
          selectedIndices={currentGround.imageIndices}
          toggleImage={(index) => {
            setCurrentGround((prev) => ({
              ...prev,
              imageIndices: prev.imageIndices.includes(index)
                ? prev.imageIndices.filter((i) => i !== index)
                : [...prev.imageIndices, index],
            }));
          }}
          onUpload={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const newFiles = Array.from(e.target.files);
              const startIndex = formData.images.length;
              // Add files to main formData
              setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...newFiles],
              }));
              // Auto-select new images for this ground
              const newIndices = newFiles.map((_, i) => startIndex + i);
              setCurrentGround((prev) => ({
                ...prev,
                imageIndices: [...prev.imageIndices, ...newIndices],
              }));
            }
          }}
        />
      )}
      {step === 5 && (
        <GroundPricingStep
          price={currentGround.price}
          setPrice={(price) => setCurrentGround({ ...currentGround, price })}
          hasHalf={currentGround.hasHalfGround}
          setHasHalf={(has) =>
            setCurrentGround({ ...currentGround, hasHalfGround: has })
          }
          halfPrice={currentGround.halfGroundPrice}
          setHalfPrice={(price) =>
            setCurrentGround({ ...currentGround, halfGroundPrice: price })
          }
          onAddAnother={handleAddAnotherGround}
          onDone={handleGroundDone}
        />
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <Background />
      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        {!(flow === "ground" && isSingleGround) && <ProgressBar step={step} />}

        {/* Form Content */}
        {flow === "venue" ? renderVenueSteps() : renderGroundSteps()}

        {/* Navigation Buttons */}
        {/* Hide default nav buttons for Step 1 (Yes/No) and Step 5 (Pricing has own buttons) of Ground Flow */}
        {!(flow === "ground" && (step === 1 || step === 5)) && (
          <motion.div
            className="flex gap-4 mt-12 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {step > 1 && (
              <motion.button
                onClick={handleBack}
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
                {flow === "venue" && step === 4 ? "Add your venue" : "Continue"}
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
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              )}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-[#ADFA1D]/20 rounded-full flex items-center justify-center">
                  <icons.Check className="text-[#ADFA1D]" size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Complex created
              </h3>
              <p className="text-neutral-400 mb-8">
                Your sports complex has been successfully registered. Now
                let&apos;s add your first ground.
              </p>
              <motion.button
                onClick={handleAddGroundStart}
                className="w-full py-4 rounded-xl font-bold text-lg bg-[#ADFA1D] text-black hover:bg-[#9DE018] shadow-[0_0_30px_rgba(173,250,29,0.3)] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add ground
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
