import { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import Cluster from "ol/source/Cluster";
import VectorSource from "ol/source/Vector";
import { StyleLike } from "ol/style/Style";
import { ReactNode, useMemo } from "react";
import { MapLayer } from "../base/MapLayer";
import { Coordinates } from "../utils";

export interface VectorLayerFeatureProps {
  style?: StyleLike;
  zIndex?: number;
  children?: ReactNode;
  layerId: string;
  visible?: boolean;
  clustering?: {
    enabled: boolean;
    distance?: number;
    minDistance?: number;
  };
}

export const MapVectorLayer = ({
  style,
  zIndex,
  layerId,
  children,
  visible = true,
  clustering,
}: VectorLayerFeatureProps) => {
  const vectorLayer = useMemo(() => {
    const vectorSource = new VectorSource({
      features: [],
    });

    let source: VectorSource | Cluster = vectorSource;

    if (clustering?.enabled) {
      source = new Cluster({
        distance: clustering?.distance,
        minDistance: clustering?.minDistance,
        source: vectorSource,
      });
    }

    return new VectorLayer({
      source,
      style,
      zIndex,
    });
  }, [style, zIndex, clustering?.enabled]);

  return (
    <MapLayer layer={vectorLayer} layerId={layerId} visible={visible}>
      {children}
    </MapLayer>
  );
};
