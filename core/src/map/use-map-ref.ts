import { useRef } from "react";
import { MapRef } from "./map-types";

export const useMapRef = () => {
  return useRef<MapRef>(null);
};
