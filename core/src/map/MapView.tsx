import { View } from "ol";
import { fromLonLat, toLonLat } from "ol/proj";
import { useCallback, useEffect, useRef } from "react";
import { useMapContext } from "./MapContext";
import { DEFAULT_MAP_CENTER } from "./map-constants";
import { areCentersEqual, coordinatesToLonLat, lonLatToCoordinates } from "./map-helpers";
import { MapViewProps } from "./map-types";

export const MapView = ({
  defaultCenter = DEFAULT_MAP_CENTER,
  defaultZoom = 8,
  center,
  onCenterChange,
  zoom,
  onZoomChange,
}: MapViewProps) => {
  const { mapInstance } = useMapContext();
  const isControlledCenter = center !== undefined;
  const isControlledZoom = zoom !== undefined;
  // Track if we're updating programmatically to avoid feedback loops
  const isProgrammaticUpdateRef = useRef(false);

  // Helper to set programmatic update flag temporarily
  const setProgrammaticUpdate = useCallback((callback: () => void) => {
    isProgrammaticUpdateRef.current = true;
    callback();
    setTimeout(() => {
      isProgrammaticUpdateRef.current = false;
    }, 0);
  }, []);

  // Initialize view - only once
  useEffect(() => {
    if (!mapInstance) return;

    const center = fromLonLat([defaultCenter.long, defaultCenter.lat]);

    const view = new View({
      center,
      zoom: defaultZoom,
      projection: "EPSG:3857",
    });

    mapInstance.setView(view);

    return () => {
      // Cleanup if needed
    };
  }, [mapInstance, defaultCenter.lat, defaultCenter.long, defaultZoom]);

  // Handle controlled center
  useEffect(() => {
    if (!mapInstance || !isControlledCenter || !center) return;

    const view = mapInstance.getView();
    if (!view) return;

    const currentCenter = view.getCenter();
    const newCenter = fromLonLat(coordinatesToLonLat(center));

    if (!areCentersEqual(currentCenter, newCenter)) {
      setProgrammaticUpdate(() => view.setCenter(newCenter));
    }
  }, [mapInstance, center, isControlledCenter, setProgrammaticUpdate]);

  // Handle controlled zoom
  useEffect(() => {
    if (!mapInstance || !isControlledZoom || zoom === undefined) return;

    const view = mapInstance.getView();
    if (!view) return;

    const currentZoom = view.getZoom();

    if (currentZoom !== zoom) {
      setProgrammaticUpdate(() => view.setZoom(zoom));
    }
  }, [mapInstance, zoom, isControlledZoom, setProgrammaticUpdate]);

  // Emit center/zoom changes when map moves (for controlled components)
  const handleMoveEnd = useCallback(() => {
    if (!mapInstance || isProgrammaticUpdateRef.current) return;

    const view = mapInstance.getView();
    if (!view) return;

    if (onCenterChange) {
      const centerCoord = view.getCenter();
      if (centerCoord) {
        onCenterChange(lonLatToCoordinates(toLonLat(centerCoord)));
      }
    }

    if (onZoomChange) {
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        onZoomChange(currentZoom);
      }
    }
  }, [mapInstance, onCenterChange, onZoomChange]);

  useEffect(() => {
    if (!mapInstance) return;

    mapInstance.on("moveend", handleMoveEnd);

    return () => {
      mapInstance.un("moveend", handleMoveEnd);
    };
  }, [mapInstance, handleMoveEnd]);

  return null;
};

