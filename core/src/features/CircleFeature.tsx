import { Feature } from "ol";
import { Circle } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { useMemo } from "react";
import { MapFeature } from "../base/MapFeature";
import { BaseFeatureProps, Coordinates } from "../utils";
import VectorLayer from "ol/layer/Vector";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import {useMapLayerContext} from "../base/MapLayerContext";

export interface CircleFeatureProps extends BaseFeatureProps {
  center: Coordinates;
  radius: number; // radius in meters
}

export const CircleFeature = ({
  center,
  radius,
  style,
  properties = {},
  visible = true,
  onClick,
  onMouseEnter,
  onMouseExit,
  hoverStyle,
}: CircleFeatureProps) => {
  const feature = useMemo(() => {
    const centerCoord = fromLonLat([center.long, center.lat]);
    return new Feature({
      geometry: new Circle(centerCoord, radius),
      ...properties,
    });
  }, [center, radius, properties]);

  const { layer } = useMapLayerContext();

  if (layer instanceof WebGLVectorLayer) {
    console.warn("CircleFeature can only be used with VectorLayer not WebGLVectorLayer.");
    return;
  }

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
