import { Map as OLMap } from "ol";
import BaseLayer from "ol/layer/Base";
import { createContext, useContext } from "react";

export interface MapContextValue {
  mapInstance: OLMap;
  registerLayer: (id: string, layer: BaseLayer) => void;
  unregisterLayer: (id: string) => void;
}

export const MapContext = createContext<MapContextValue | null>(null);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("Map components must be used within a <Map> component");
  }
  return context;
};
