import WebGLTileLayer from "ol/layer/WebGLTile";
import type { Options as WebGLTileLayerOptions } from "ol/layer/WebGLTile";
import { useEffect, useMemo } from "react";
import { useMapContext } from "../map/MapContext";

export interface MapWebGLTileLayerProps {
  source: WebGLTileLayerOptions['source']
  zIndex?: number;
  opacity?: number;
  visible?: boolean;
  style?: WebGLTileLayerOptions["style"];
}

export const MapWebGLTileLayer = ({
  source,
  zIndex,
  opacity,
  visible = true,
  style,
}: MapWebGLTileLayerProps) => {
  const { mapInstance } = useMapContext();

  const webglTileLayer = useMemo(() => {
    return new WebGLTileLayer({
      source,
      zIndex,
      opacity,
      visible,
      style,
    });
  }, [source, zIndex, opacity, visible, style]);

  useEffect(() => {
    if (!mapInstance) return;

    mapInstance.addLayer(webglTileLayer);

    return () => {
      mapInstance.removeLayer(webglTileLayer);
    };
  }, [mapInstance, webglTileLayer]);

  useEffect(() => {
    webglTileLayer.setVisible(visible);
  }, [webglTileLayer, visible]);

  return null;
};

