import React from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import * as icons from "./icons";
import * as animations from "./animations";
import { FormData, Sport, SportId } from "./types";
import LocationMap from "./location-map";

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

interface StepOneProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function StepOne({ formData, setFormData }: StepOneProps) {
  return (
    <motion.div
      key="step1"
      variants={animations.containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <motion.div variants={animations.itemVariants}>
        <h1 className="text-5xl sm:text-6xl font-bold mb-3 tracking-tight ">
          <span className="bg-linear-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            Welcome!
          </span>{" "}
          <span>👋</span>
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
  );
}

interface StepTwoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function StepTwo({ formData, setFormData }: StepTwoProps) {
  return (
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
          <span className="tracking-tight bg-linear-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            Location
          </span>
          <span>📍</span>
        </h1>
        <p className="text-neutral-400 text-xl">Where is your turf located?</p>
      </motion.div>

      <motion.div variants={animations.itemVariants}>
        <label className="block text-sm font-medium mb-2 text-neutral-300 uppercase tracking-wider">
          Full Address
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
          Pin Location on Map
        </label>
        <LocationMap
          latitude={formData.latitude}
          longitude={formData.longitude}
          onLocationFound={(lat: number, lng: number) =>
            setFormData({ ...formData, latitude: lat, longitude: lng })
          }
        />
      </motion.div>
    </motion.div>
  );
}

interface StepThreeProps {
  formData: FormData;
  handleSportToggle: (sportId: SportId) => void;
}

export function StepThree({ formData, handleSportToggle }: StepThreeProps) {
  return (
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
          <span className="tracking-tight bg-linear-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            Almost done!
          </span>{" "}
          <span>⚽</span>
        </h1>
        <p className="text-neutral-400 text-xl">What sports do you offer?</p>
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
  );
}

interface StepFourProps {
  formData: FormData;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export function StepFour({
  formData,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileSelect,
  removeImage,
}: StepFourProps) {
  return (
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
          <span className="tracking-tight bg-linear-to-br from-white to-neutral-500 bg-clip-text text-transparent">
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
  );
}

interface MultipleGroundsStepProps {
  onYes: () => void;
  onNo: () => void;
}

export function MultipleGroundsStep({ onYes, onNo }: MultipleGroundsStepProps) {
  return (
    <motion.div
      key="multiple-grounds"
      variants={animations.containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center"
    >
      <motion.h2
        variants={animations.itemVariants}
        className="text-3xl font-bold mb-8"
      >
        Do you have multiple grounds?
      </motion.h2>
      <motion.div
        variants={animations.itemVariants}
        className="flex gap-4 justify-center"
      >
        <motion.button
          onClick={onYes}
          className="px-8 py-4 rounded-xl border-2 border-neutral-800 text-white font-bold hover:bg-neutral-800 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Yes
        </motion.button>
        <motion.button
          onClick={onNo}
          className="px-8 py-4 rounded-xl bg-[#ADFA1D] text-black font-bold hover:bg-[#9DE018] shadow-[0_0_30px_rgba(173,250,29,0.3)] transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          No
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

interface GroundDetailsStepProps {
  onDone: () => void;
}

import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export function GroundDetailsStep({ onDone }: GroundDetailsStepProps) {
  const [groundPrice, setGroundPrice] = useState("");
  const [hasHalfGround, setHasHalfGround] = useState(false);
  const [halfGroundPrice, setHalfGroundPrice] = useState("");

  return (
    <motion.div
      key="ground-details"
      variants={animations.containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2
        variants={animations.itemVariants}
        className="text-3xl font-bold mb-8 text-center"
      >
        Ground Details
      </motion.h2>

      <motion.div variants={animations.itemVariants} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2 uppercase">
            Price / hour
          </label>
          <input
            type="number"
            value={groundPrice}
            onChange={(e) => setGroundPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#ADFA1D] focus:border-transparent outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <span className="font-medium">Half Ground Available</span>
          <Switch checked={hasHalfGround} onCheckedChange={setHasHalfGround} />
        </div>

        {/* Using CSS visibility/display to toggle without unmounting for performance */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            hasHalfGround ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Half Ground Price
          </label>
          <input
            type="number"
            value={halfGroundPrice}
            onChange={(e) => setHalfGroundPrice(e.target.value)}
            placeholder="Enter half ground price"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#ADFA1D] focus:border-transparent outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <motion.button
          onClick={onDone}
          disabled={!groundPrice || (hasHalfGround && !halfGroundPrice)}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg mt-8 ${
            groundPrice && (!hasHalfGround || halfGroundPrice)
              ? "bg-[#ADFA1D] text-black hover:bg-[#9DE018] shadow-[0_0_30px_rgba(173,250,29,0.3)]"
              : "bg-neutral-900 text-neutral-600 cursor-not-allowed border-2 border-neutral-800"
          }`}
          whileHover={
            groundPrice && (!hasHalfGround || halfGroundPrice)
              ? { scale: 1.02 }
              : {}
          }
          whileTap={
            groundPrice && (!hasHalfGround || halfGroundPrice)
              ? { scale: 0.98 }
              : {}
          }
        >
          DONE
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

interface GroundNameStepProps {
  name: string;
  setName: (name: string) => void;
}

export function GroundNameStep({ name, setName }: GroundNameStepProps) {
  return (
    <motion.div
      key="ground-name"
      variants={animations.containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <motion.div variants={animations.itemVariants}>
        <h1 className="text-4xl font-bold mb-3">Name your ground</h1>
        <p className="text-neutral-400 text-xl">
          Give this specific ground a name (optional)
        </p>
      </motion.div>

      <motion.div variants={animations.itemVariants}>
        <label className="block text-sm font-medium mb-2 text-neutral-300 uppercase tracking-wider">
          Ground Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-neutral-900/50 backdrop-blur-sm border-2 border-neutral-800 rounded-2xl py-5 px-6 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ADFA1D] focus:ring-4 focus:ring-[#ADFA1D]/10 transition-all text-lg shadow-lg"
          placeholder="e.g., North Wing, Court 1"
        />
      </motion.div>
    </motion.div>
  );
}

interface GroundSportsStepProps {
  availableSports: SportId[];
  selectedSports: SportId[];
  toggleSport: (sportId: SportId) => void;
}

export function GroundSportsStep({
  availableSports,
  selectedSports,
  toggleSport,
}: GroundSportsStepProps) {
  return (
    <motion.div
      key="ground-sports"
      variants={animations.containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <motion.div variants={animations.itemVariants}>
        <h1 className="text-4xl font-bold mb-3">Select Sports</h1>
        <p className="text-neutral-400 text-xl">
          Which sports are played on this ground?
        </p>
      </motion.div>

      <motion.div
        variants={animations.itemVariants}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        {availableSports.map((sportId) => {
          const sport = sports.find((s) => s.id === sportId);
          if (!sport) return null;
          const Icon = sport.icon;
          const isSelected = selectedSports.includes(sportId);

          return (
            <motion.button
              key={sport.id}
              onClick={() => toggleSport(sport.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group ${
                isSelected
                  ? "border-[#ADFA1D] bg-[#ADFA1D]/10 shadow-[0_0_30px_rgba(173,250,29,0.15)]"
                  : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-600 hover:bg-neutral-800/50"
              }`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center gap-3">
                <Icon
                  size={32}
                  className={`transition-colors ${
                    isSelected ? "text-[#ADFA1D]" : "text-neutral-500"
                  }`}
                />
                <span
                  className={`text-sm font-semibold tracking-wide ${
                    isSelected ? "text-white" : "text-neutral-400"
                  }`}
                >
                  {sport.name}
                </span>
              </div>
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
  );
}

interface GroundImagesStepProps {
  allImages: File[];
  selectedIndices: number[];
  toggleImage: (index: number) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GroundImagesStep({
  allImages,
  selectedIndices,
  toggleImage,
  onUpload,
}: GroundImagesStepProps) {
  return (
    <motion.div
      key="ground-images"
      variants={animations.containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <motion.div variants={animations.itemVariants}>
        <h1 className="text-4xl font-bold mb-3">Ground Photos</h1>
        <p className="text-neutral-400 text-xl">
          Select photos for this ground or upload new ones
        </p>
      </motion.div>

      <motion.div
        variants={animations.itemVariants}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        {/* Upload Button */}
        <label className="cursor-pointer aspect-video rounded-xl border-2 border-dashed border-neutral-700 hover:border-[#ADFA1D] hover:bg-[#ADFA1D]/5 flex flex-col items-center justify-center gap-2 transition-all group">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onUpload}
            className="hidden"
          />
          <icons.Upload className="text-neutral-500 group-hover:text-[#ADFA1D] transition-colors" />
          <span className="text-sm text-neutral-500 group-hover:text-white transition-colors">
            Add New
          </span>
        </label>

        {/* Existing Images */}
        {allImages.map((file, index) => {
          const isSelected = selectedIndices.includes(index);
          return (
            <motion.div
              key={index}
              onClick={() => toggleImage(index)}
              className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                isSelected ? "border-[#ADFA1D]" : "border-transparent"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`Ground option ${index}`}
                fill
                className={`object-cover transition-opacity ${
                  isSelected ? "opacity-100" : "opacity-60 hover:opacity-80"
                }`}
              />
              {isSelected && (
                <div className="absolute top-2 right-2 bg-[#ADFA1D] text-black rounded-full p-1">
                  <icons.Check size={12} strokeWidth={3} />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

interface GroundPricingStepProps {
  price: string;
  setPrice: (price: string) => void;
  hasHalf: boolean;
  setHasHalf: (has: boolean) => void;
  halfPrice: string;
  setHalfPrice: (price: string) => void;
  onAddAnother: () => void;
  onDone: () => void;
}

export function GroundPricingStep({
  price,
  setPrice,
  hasHalf,
  setHasHalf,
  halfPrice,
  setHalfPrice,
  onAddAnother,
  onDone,
}: GroundPricingStepProps) {
  const isValid = price && (!hasHalf || halfPrice);

  return (
    <motion.div
      key="ground-pricing"
      variants={animations.containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <motion.div variants={animations.itemVariants}>
        <h1 className="text-4xl font-bold mb-3">Pricing</h1>
        <p className="text-neutral-400 text-xl">
          Set the hourly rate for this ground
        </p>
      </motion.div>

      <motion.div variants={animations.itemVariants} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2 uppercase">
            Price / hour
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#ADFA1D] focus:border-transparent outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <span className="font-medium">Half Ground Available</span>
          <Switch checked={hasHalf} onCheckedChange={setHasHalf} />
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            hasHalf ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Half Ground Price
          </label>
          <input
            type="number"
            value={halfPrice}
            onChange={(e) => setHalfPrice(e.target.value)}
            placeholder="Enter half ground price"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#ADFA1D] focus:border-transparent outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <motion.button
            onClick={onAddAnother}
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-bold text-lg border-2 transition-all ${
              isValid
                ? "border-[#ADFA1D] text-[#ADFA1D] hover:bg-[#ADFA1D]/10"
                : "border-neutral-800 text-neutral-600 cursor-not-allowed"
            }`}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
          >
            Add Another Ground
          </motion.button>

          <motion.button
            onClick={onDone}
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              isValid
                ? "bg-[#ADFA1D] text-black hover:bg-[#9DE018] shadow-[0_0_30px_rgba(173,250,29,0.3)]"
                : "bg-neutral-900 text-neutral-600 cursor-not-allowed border-2 border-neutral-800"
            }`}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
          >
            DONE
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
