import { MapBrowserEvent, Map as OLMap, View } from "ol";
import BaseLayer from "ol/layer/Base";
import { fromLonLat, toLonLat } from "ol/proj";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import "ol/ol.css";
import { MapLayersMap } from "../utils";
import { MapContext } from "./MapContext";
import { DEFAULT_MAP_CENTER } from "./map-constants";
import {
  areCentersEqual,
  calculateFeaturesExtent,
  calculateLayerExtents,
  coordinatesToLonLat,
  lonLatToCoordinates,
  normalizePadding,
} from "./map-helpers";
import { MapProps, MapRef } from "./map-types";

export const OpenLayersMap = forwardRef<MapRef, MapProps>(
  (
    {
      defaultCenter = DEFAULT_MAP_CENTER,
      defaultZoom = 8,
      center,
      onCenterChange,
      zoom,
      onZoomChange,
      children,
      onClick,
      wrapperProps,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<OLMap | null>(null);
    const [, forceUpdate] = useState({});
    const layersRef = useRef<MapLayersMap>({});
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

    // Initialize map - only once, no dependencies to avoid recreation
    useEffect(() => {
      if (!containerRef.current || mapInstanceRef.current) return;

      const center = fromLonLat([defaultCenter.long, defaultCenter.lat]);

      mapInstanceRef.current = new OLMap({
        target: containerRef.current,
        layers: [],
        view: new View({
          center,
          zoom: defaultZoom,
          projection: "EPSG:3857",
        }),
      });

      forceUpdate({}); // Trigger re-render to provide context

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setTarget(undefined);
          mapInstanceRef.current = null;
        }
      };
    }, [defaultCenter.lat, defaultCenter.long, defaultZoom]);

    // Handle controlled center
    useEffect(() => {
      if (!mapInstanceRef.current || !isControlledCenter || !center) return;

      const view = mapInstanceRef.current.getView();
      const currentCenter = view.getCenter();
      const newCenter = fromLonLat(coordinatesToLonLat(center));

      if (!areCentersEqual(currentCenter, newCenter)) {
        setProgrammaticUpdate(() => view.setCenter(newCenter));
      }
    }, [center, isControlledCenter, setProgrammaticUpdate]);

    // Handle controlled zoom
    useEffect(() => {
      if (!mapInstanceRef.current || !isControlledZoom || zoom === undefined) return;

      const view = mapInstanceRef.current.getView();
      const currentZoom = view.getZoom();

      if (currentZoom !== zoom) {
        setProgrammaticUpdate(() => view.setZoom(zoom));
      }
    }, [zoom, isControlledZoom, setProgrammaticUpdate]);

    // Emit center/zoom changes when map moves (for controlled components)
    const handleMoveEnd = useCallback(() => {
      if (!mapInstanceRef.current || isProgrammaticUpdateRef.current) return;

      const view = mapInstanceRef.current.getView();

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
    }, [onCenterChange, onZoomChange]);

    useEffect(() => {
      if (!mapInstanceRef.current) return;

      mapInstanceRef.current.on("moveend", handleMoveEnd);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.un("moveend", handleMoveEnd);
        }
      };
    }, [handleMoveEnd]);

    // Handle click events
    useEffect(() => {
      if (!mapInstanceRef.current || !onClick) return;

      const handleClick = (event: MapBrowserEvent<any>) => {
        const coordinates = lonLatToCoordinates(toLonLat(event.coordinate));
        onClick(coordinates, event);
      };

      mapInstanceRef.current.on("click", handleClick);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.un("click", handleClick);
        }
      };
    }, [onClick]);

    // Layer registration callbacks
    const registerLayer = useCallback((id: string, layer: BaseLayer) => {
      layersRef.current[id] = layer;
    }, []);

    const unregisterLayer = useCallback((id: string) => {
      delete layersRef.current[id];
    }, []);

    // Imperative handle - expose methods like MUI DataGrid
    useImperativeHandle(
      ref,
      () =>
        ({
          getMap: () => mapInstanceRef.current,
          centerOn: (coordinate, zoom?) => {
            if (!mapInstanceRef.current) return;
            const view = mapInstanceRef.current.getView();
            view.setCenter(fromLonLat(coordinatesToLonLat(coordinate)));
            if (zoom !== undefined) {
              view.setZoom(zoom);
            }
          },
          getCenter: () => {
            if (!mapInstanceRef.current) return null;
            const center = mapInstanceRef.current.getView().getCenter();
            if (!center) return null;
            return lonLatToCoordinates(toLonLat(center));
          },
          getZoom: () => {
            if (!mapInstanceRef.current) return null;
            return mapInstanceRef.current.getView().getZoom() ?? null;
          },
          setZoom: (zoom) => {
            if (!mapInstanceRef.current) return;
            mapInstanceRef.current.getView().setZoom(zoom);
          },
          fitToExtent: (extent) => {
            if (!mapInstanceRef.current) return;

            const targetExtent = extent || calculateLayerExtents(Object.values(layersRef.current));

            if (targetExtent) {
              mapInstanceRef.current.getView().fit(targetExtent, {
                padding: normalizePadding(),
              });
            }
          },
          fitAll: (padding) => {
            if (!mapInstanceRef.current) return;

            const layers = Object.values(layersRef.current);
            if (layers.length === 0) return;

            const { extent, hasFeatures } = calculateFeaturesExtent(layers);

            if (hasFeatures) {
              mapInstanceRef.current.getView().fit(extent, {
                padding: normalizePadding(padding),
              });
            }
          },
          getLayers: () => layersRef.current,
        }) satisfies MapRef,
      [],
    );

    return (
      <div className="ol-map-wrapper" {...wrapperProps} style={{ position: "relative", ...wrapperProps?.style }}>
        <div
          className="ol-map-container"
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        {mapInstanceRef.current && (
          <MapContext.Provider value={{ mapInstance: mapInstanceRef.current, registerLayer, unregisterLayer }}>
            {children}
          </MapContext.Provider>
        )}
      </div>
    );
  },
);
