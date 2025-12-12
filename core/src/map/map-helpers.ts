import { createEmpty, Extent, extend } from "ol/extent";
import BaseLayer from "ol/layer/Base";
import VectorLayer from "ol/layer/Vector";
import { Coordinates } from "../utils";

export const coordinatesToLonLat = (coords: Coordinates): [number, number] => {
  return [coords.long, coords.lat];
};

export const lonLatToCoordinates = (lonLat: number[]): Coordinates => {
  return { long: lonLat[0], lat: lonLat[1] };
};

export const areCentersEqual = (center1: number[] | undefined, center2: number[], threshold = 0.01): boolean => {
  if (!center1) return false;
  return Math.abs(center1[0] - center2[0]) <= threshold && Math.abs(center1[1] - center2[1]) <= threshold;
};

export const normalizePadding = (padding?: number | number[]): number[] => {
  if (typeof padding === "number") {
    return [padding, padding, padding, padding];
  }
  return padding || [100, 100, 100, 100];
};

export const calculateLayerExtents = (layers: BaseLayer[]): number[] | null => {
  if (layers.length === 0) return null;

  let targetExtent: number[] | null = null;

  layers.forEach((layer) => {
    const layerExtent = layer.getExtent();
    if (layerExtent) {
      if (!targetExtent) {
        targetExtent = [...layerExtent];
      } else {
        targetExtent[0] = Math.min(targetExtent[0], layerExtent[0]);
        targetExtent[1] = Math.min(targetExtent[1], layerExtent[1]);
        targetExtent[2] = Math.max(targetExtent[2], layerExtent[2]);
        targetExtent[3] = Math.max(targetExtent[3], layerExtent[3]);
      }
    }
  });

  return targetExtent;
};

export const calculateFeaturesExtent = (layers: BaseLayer[]): { extent: Extent; hasFeatures: boolean } => {
  const targetExtent = createEmpty();
  let hasFeatures = false;

  layers.forEach((layer) => {
    if (layer instanceof VectorLayer) {
      const source = layer.getSource();
      if (source) {
        const features = source.getFeatures();
        features.forEach((feature: any) => {
          const geometry = feature.getGeometry();
          if (geometry) {
            const featureExtent = geometry.getExtent();
            extend(targetExtent, featureExtent);
            hasFeatures = true;
          }
        });
      }
    }
  });

  return { extent: targetExtent, hasFeatures };
};
