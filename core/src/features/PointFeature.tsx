import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { useMemo } from "react";
import { MapFeature } from "../base/MapFeature";
import { BaseFeatureProps, Coordinates } from "../utils";

export interface PointFeatureProps extends BaseFeatureProps {
  coordinates: Coordinates;
}

export const PointFeature = ({
  coordinates,
  style,
  properties = {},
  visible = true,
  onClick,
  onMouseEnter,
  onMouseExit,
  hoverStyle,
}: PointFeatureProps) => {
  const feature = useMemo(() => {
    const coord = fromLonLat([coordinates.long, coordinates.lat]);
    return new Feature({
      geometry: new Point(coord),
      ...properties,
    });
  }, [coordinates.long, coordinates.lat, properties]);

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
