import { Feature } from "ol";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import type { Options as WebGLVectorLayerOptions } from "ol/layer/WebGLVector";
import VectorSource from "ol/source/Vector";
import { ReactNode, useMemo } from "react";
import { MapLayer } from "../base/MapLayer";

export interface MapWebGLVectorLayerProps {
  style: WebGLVectorLayerOptions["style"];
  features?: Feature[];
  zIndex?: number;
  children?: ReactNode;
  layerId: string;
  visible?: boolean;
  disableHitDetection?: boolean;
}

export const MapWebGLVectorLayer = ({
  style,
  features = [],
  zIndex,
  layerId,
  children,
  visible = true,
  disableHitDetection = false,
}: MapWebGLVectorLayerProps) => {
  const webglVectorLayer = useMemo(() => {
    const source = new VectorSource({
      features,
    });

    return new WebGLVectorLayer({
      source,
      style,
      zIndex,
      disableHitDetection,
    });
  }, [style, features, zIndex, disableHitDetection]);


  return (
    <MapLayer layer={webglVectorLayer} layerId={layerId} visible={visible}>
      {children}
    </MapLayer>
  );
};

