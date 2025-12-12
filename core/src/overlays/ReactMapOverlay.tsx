import { fromLonLat } from "ol/proj";
import { ReactNode, useEffect, useState } from "react";
import { useMapContext } from "../map/MapContext";
import { Coordinates } from "../utils";

export interface ReactMapOverlayProps {
  coordinates: Coordinates;
  children: ReactNode;
  transform?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ReactMapOverlay = ({
  coordinates,
  children,
  transform = "translate(-50%, -100%)",
  className,
  style,
}: ReactMapOverlayProps) => {
  const { mapInstance: map } = useMapContext();
  const [pixel, setPixel] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!map) return;

    const coord = fromLonLat([coordinates.long, coordinates.lat]);

    const update = () => {
      const px = map.getPixelFromCoordinate(coord);
      if (px) {
        setPixel([px[0], px[1]]);
      } else {
        setPixel(null);
      }
    };

    update();
    map.on("postrender", update);
    return () => {
      map.un("postrender", update);
    };
  }, [map, coordinates.lat, coordinates.long]);

  if (!pixel) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: pixel[0],
        top: pixel[1],
        transform,
        pointerEvents: "auto",
        zIndex: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
