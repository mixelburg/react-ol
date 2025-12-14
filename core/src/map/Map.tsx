import { MapBrowserEvent, Map as OLMap } from "ol";
import BaseLayer from "ol/layer/Base";
import { fromLonLat, toLonLat } from "ol/proj";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import "ol/ol.css";
import { MapLayersMap } from "../utils";
import { MapContext } from "./MapContext";
import {
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

    // Initialize map - only once, no dependencies to avoid recreation
    useEffect(() => {
      if (!containerRef.current || mapInstanceRef.current) return;

      mapInstanceRef.current = new OLMap({
        target: containerRef.current,
        layers: [],
      });

      forceUpdate({}); // Trigger re-render to provide context

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setTarget(undefined);
          mapInstanceRef.current = null;
        }
      };
    }, []);

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
