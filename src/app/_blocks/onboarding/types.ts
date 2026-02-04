import React from "react";

export type SportId =
  | "football"
  | "cricket"
  | "basketball"
  | "tennis"
  | "badminton"
  | "volleyball"
  | "swimming"
  | "gym";

export type Sport = {
  id: SportId;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export type FormData = {
  placeName: string;
  address: string;
  sports: SportId[];
  images: File[];
  latitude?: number;
  longitude?: number;
  locationUrl?: string;
};

export interface GroundData {
  id: string;
  name: string;
  sports: SportId[];
  imageIndices: number[]; // Indices of images in the main formData.images array
  price: string;
  hasHalfGround: boolean;
  halfGroundPrice: string;
}
