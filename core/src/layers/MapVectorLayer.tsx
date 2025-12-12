import { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { StyleLike } from "ol/style/Style";
import { ReactNode, useMemo } from "react";
import { MapLayer } from "../base/MapLayer";

export interface VectorLayerFeatureProps {
  style?: StyleLike;
  features?: Feature[];
  zIndex?: number;
  children?: ReactNode;
  layerId: string;
  visible?: boolean;
}

export const MapVectorLayer = ({
  style,
  features = [],
  zIndex,
  layerId,
  children,
  visible = true,
}: VectorLayerFeatureProps) => {
  const vectorLayer = useMemo(() => {
    const source = new VectorSource({
      features,
    });

    return new VectorLayer({
      source,
      style,
      zIndex,
    });
  }, [style, features, zIndex]);

  return (
    <MapLayer layer={vectorLayer} layerId={layerId} visible={visible}>
      {children}
    </MapLayer>
  );
};
