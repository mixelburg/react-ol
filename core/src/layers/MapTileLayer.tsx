import TileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import { useEffect, useMemo } from "react";
import { useMapContext } from "../map/MapContext";

export interface MapTileLayerProps {
  source: TileSource;
  zIndex?: number;
  opacity?: number;
  visible?: boolean;
}

export const MapTileLayer = ({ source, zIndex, opacity, visible = true }: MapTileLayerProps) => {
  const { mapInstance } = useMapContext();

  const tileLayer = useMemo(() => {
    return new TileLayer({
      source,
      zIndex,
      opacity,
      visible,
    });
  }, [zIndex, opacity, visible]);

  useEffect(() => {
    if (!mapInstance) return;

    mapInstance.addLayer(tileLayer);

    return () => {
      mapInstance.removeLayer(tileLayer);
    };
  }, [mapInstance, tileLayer]);

  useEffect(() => {
    tileLayer.setVisible(visible);
  }, [tileLayer, visible]);

  return null;
};
