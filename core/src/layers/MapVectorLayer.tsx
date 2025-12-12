import { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import { StyleLike } from "ol/style/Style";
import { Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import { MapLayer } from "../base/MapLayer";
import { useMapContext } from "../map/MapContext";
import {Coordinates} from "../utils";

export interface VectorLayerFeatureProps {
  style?: StyleLike;
  zIndex?: number;
  children?: ReactNode;
  layerId: string;
  visible?: boolean;
  clustering?: {
    enabled: boolean;
    distance?: number;
    renderCluster?: (features: Feature[], coords: Coordinates) => ReactNode;
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
  const { mapInstance } = useMapContext();
  const [clusterFeatures, setClusterFeatures] = useState<Feature[]>([]);

  const vectorLayer = useMemo(() => {
    const vectorSource = new VectorSource({
      features: [],
    });

    let source: VectorSource | Cluster;

    if (clustering?.enabled) {
      source = new Cluster({
        distance: clustering.distance ?? 40,
        source: vectorSource,
      });
    } else {
      source = vectorSource;
    }

    return new VectorLayer({
      source,
      style,
      zIndex,
    });
  }, [style, zIndex, clustering?.enabled, clustering?.distance]);

  // Update cluster features when map view changes (zoom/pan) or source changes
  useEffect(() => {
    if (!mapInstance || !clustering?.enabled || !clustering?.renderCluster) {
      setClusterFeatures([]);
      return;
    }

    const updateClusters = () => {
      const source = vectorLayer.getSource();
      if (source instanceof Cluster) {
      }
    };

    // Delay initial update to ensure features are loaded
    const timeoutId = setTimeout(updateClusters, 100);

    // Update on map movement
    const view = mapInstance.getView();
    view.on("change:resolution", updateClusters);
    view.on("change:center", updateClusters);

    // Update when source features change (added/removed by child components)
    const source = vectorLayer.getSource();
    let vectorSource: VectorSource | null = null;
    let clusterSource: Cluster | null = null;

    if (source instanceof Cluster) {
      clusterSource = source;
      vectorSource = source.getSource();
      // Listen to cluster source changes
      clusterSource.on("change", updateClusters);
    } else if (source instanceof VectorSource) {
      vectorSource = source;
    }

    if (vectorSource) {
      vectorSource.on("addfeature", updateClusters);
      vectorSource.on("removefeature", updateClusters);
    }

    return () => {
      clearTimeout(timeoutId);
      view.un("change:resolution", updateClusters);
      view.un("change:center", updateClusters);

      if (clusterSource) {
        clusterSource.un("change", updateClusters);
      }

      if (vectorSource) {
        vectorSource.un("addfeature", updateClusters);
        vectorSource.un("removefeature", updateClusters);
      }
    };
  }, [mapInstance, vectorLayer, clustering?.enabled, clustering?.renderCluster]);

  const renderContent = () => {
    // If clustering is enabled and we have a render function
    if (clustering?.enabled && clustering.renderCluster) {
    }

    // No clustering, just render children
    return children;
  };

  return (
    <MapLayer layer={vectorLayer} layerId={layerId} visible={visible}>
      {renderContent()}
    </MapLayer>
  );
};
