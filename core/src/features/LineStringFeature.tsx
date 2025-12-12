import { Feature } from "ol";
import { LineString } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { useMemo } from "react";
import { MapFeature } from "../base/MapFeature";
import { BaseFeatureProps, Coordinates } from "../utils";

export interface LineStringFeatureProps extends BaseFeatureProps {
  coordinates: Coordinates[];
}

export const LineStringFeature = ({
  coordinates,
  style,
  properties = {},
  visible = true,
  onClick,
  onMouseEnter,
  onMouseExit,
  hoverStyle,
}: LineStringFeatureProps) => {
  const feature = useMemo(() => {
    const coords = coordinates.map((coord) => fromLonLat([coord.long, coord.lat]));
    return new Feature({
      geometry: new LineString(coords),
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
