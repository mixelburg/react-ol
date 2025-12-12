import BaseLayer from "ol/layer/Base";
import { createContext, useContext } from "react";

export interface MapLayerContextValue {
  layer: BaseLayer;
}

export const MapLayerContext = createContext<MapLayerContextValue | null>(null);

export const useMapLayerContext = () => {
  const context = useContext(MapLayerContext);
  if (!context) {
    throw new Error("MapFeature must be used within a <MapLayer> component");
  }
  return context;
};
