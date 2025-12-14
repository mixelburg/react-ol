import { MapBrowserEvent, Map as OLMap } from "ol";
import type { ViewOptions } from "ol/View";
import { ReactNode } from "react";
import { Coordinates, MapLayersMap } from "../utils";

export interface MapViewProps extends Omit<ViewOptions, "center" | "zoom"> {
  // Uncontrolled props (default values)
  defaultCenter?: Coordinates;
  defaultZoom?: number;
  // Controlled props
  center?: Coordinates;
  onCenterChange?: (center: Coordinates) => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

export interface MapProps {
  elevation?: number;
  children?: ReactNode;
  onClick?: (coordinate: Coordinates, event: MapBrowserEvent<any>) => void;
  wrapperProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

export interface MapRef {
  getMap: () => OLMap | null;
  centerOn: (coordinate: Coordinates, zoom?: number) => void;
  getCenter: () => Coordinates | null;
  getZoom: () => number | null;
  setZoom: (zoom: number) => void;
  fitToExtent: (extent?: number[]) => void;
  fitAll: (padding?: number | number[]) => void;
  getLayers: () => MapLayersMap;
}
