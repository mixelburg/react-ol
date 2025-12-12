import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { useMemo } from "react";
import { MapFeature } from "../base/MapFeature";
import { BaseFeatureProps, Coordinates } from "../utils";

export interface PolygonFeatureProps extends BaseFeatureProps {
  coordinates: Coordinates[];
}

export const PolygonFeature = ({
  coordinates,
  style,
  properties = {},
  visible = true,
  onClick,
  onMouseEnter,
  onMouseExit,
  hoverStyle,
}: PolygonFeatureProps) => {
  const feature = useMemo(() => {
    const coords = coordinates.map((coord) => fromLonLat([coord.long, coord.lat]));
    return new Feature({
      geometry: new Polygon([coords]),
      ...properties,
    });
  }, [coordinates, properties]);

  return (
    <MapFeature
      feature={feature}
      style={style}
      visible={visible}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseExit={onMouseExit}
      hoverStyle={hoverStyle}
    />
  );
};
