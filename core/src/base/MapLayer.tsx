import BaseLayer from "ol/layer/Base";
import { ReactNode, useEffect, useState } from "react";
import { useMapContext } from "../map/MapContext";
import { MapLayerContext } from "./MapLayerContext";

export interface MapLayerProps {
  layer: BaseLayer;
  children?: ReactNode;
  layerId: string;
  visible?: boolean;
}

export const MapLayer = ({ layer, children, layerId, visible = true }: MapLayerProps) => {
  const { mapInstance, registerLayer, unregisterLayer } = useMapContext();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!mapInstance) return;

    registerLayer(layerId, layer);
    mapInstance.addLayer(layer);
    setIsRegistered(true);

    return () => {
      unregisterLayer(layerId);
      mapInstance.removeLayer(layer);
      setIsRegistered(false);
    };
  }, [mapInstance, layer, layerId, registerLayer, unregisterLayer]);

  useEffect(() => {
    if (isRegistered) {
      layer.setVisible(visible);
    }
  }, [layer, visible, isRegistered]);

  if (!isRegistered) return null;

  return <MapLayerContext.Provider value={{ layer }}>{children}</MapLayerContext.Provider>;
};
