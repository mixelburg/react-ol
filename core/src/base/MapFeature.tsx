import { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { StyleLike } from "ol/style/Style";
import { useEffect } from "react";
import { useMapContext } from "../map/MapContext";
import { useMapLayerContext } from "./MapLayerContext";
import WebGLVectorLayer from "ol/layer/WebGLVector";

export interface MapFeatureProps {
  feature: Feature;
  style?: StyleLike;
  hoverStyle?: StyleLike;
  visible?: boolean;
  onClick?: (feature: Feature, event: any) => void;
  onMouseEnter?: (feature: Feature, event: any) => void;
  onMouseExit?: (feature: Feature, event: any) => void;
}

export const MapFeature = ({
  feature,
  style,
  visible = true,
  onClick,
  onMouseEnter,
  onMouseExit,
  hoverStyle,
}: MapFeatureProps) => {
  const { layer } = useMapLayerContext();
  const { mapInstance } = useMapContext();

  useEffect(() => {
    if (!(layer instanceof VectorLayer || layer instanceof WebGLVectorLayer)) {
      console.warn("MapFeature can only be used with VectorLayer or WebGLVectorLayer");
      return;
    }

    const source = layer.getSource();
    if (!(source instanceof VectorSource)) {
      console.warn("MapFeature requires a VectorSource");
      return;
    }

    if (style) {
      feature.setStyle(style);
    }

    if (visible) {
      source.addFeature(feature);
    }

    return () => {
      if (source.hasFeature(feature)) {
        source.removeFeature(feature);
      }
    };
  }, [layer, feature, style, visible]);

  useEffect(() => {
    if (!mapInstance || !onClick) {
      return;
    }

    const handleClick = (evt: any) => {
      const pixel = mapInstance.getEventPixel(evt.originalEvent);
      mapInstance.forEachFeatureAtPixel(pixel, (foundFeature: any) => {
        if (foundFeature === feature) {
          onClick(feature, evt);
          return true;
        }
        return false;
      });
    };

    mapInstance.on("click", handleClick);

    return () => {
      mapInstance.un("click", handleClick);
    };
  }, [mapInstance, feature, onClick]);

  useEffect(() => {
    if (!mapInstance || (!onMouseEnter && !onMouseExit && !hoverStyle)) {
      return;
    }

    let isHovering = false;

    const handlePointerMove = (evt: any) => {
      const pixel = mapInstance.getEventPixel(evt.originalEvent);
      let foundFeature = false;

      mapInstance.forEachFeatureAtPixel(pixel, (foundFeat: any) => {
        if (foundFeat === feature) {
          foundFeature = true;
          return true;
        }
        return false;
      });

      if (foundFeature && !isHovering) {
        isHovering = true;
        onMouseEnter?.(feature, evt);
      } else if (!foundFeature && isHovering) {
        isHovering = false;
        onMouseExit?.(feature, evt);
      }

      if (isHovering && hoverStyle) {
        feature.setStyle(hoverStyle);
      } else {
        feature.setStyle(style);
      }
    };

    mapInstance.on("pointermove", handlePointerMove);

    return () => {
      mapInstance.un("pointermove", handlePointerMove);
      if (isHovering && onMouseExit) {
        onMouseExit(feature, null);
      }
    };
  }, [mapInstance, feature, onMouseEnter, onMouseExit, hoverStyle, style]);

  return null;
};
