"use client";

import {
  CircleFeature,
  LineStringFeature,
  MapView,
  MapWebGLTileLayer,
  MapWebGLVectorLayer,
  OpenLayersMap,
  PointFeature,
  PolygonFeature,
  useMapRef,
} from "@mixelburg/react-ol";
import { Paper, Stack } from "@mui/material";
import type { Options as WebGLVectorLayerOptions } from "ol/layer/WebGLVector";
import DataTileSource from "ol/source/DataTile";
import { FC } from "react";

const source = new DataTileSource({
  loader: async (z, x, y) => {
    const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    await img.decode();
    return img;
  },
});

const vectorLayerStyle: WebGLVectorLayerOptions["style"] = {
  "circle-radius": [
    "case",
    ["==", ["geometry-type"], "Point"],
    8,
    ["==", ["geometry-type"], "Circle"],
    ["get", "radius"],
    0,
  ],
  "circle-fill-color": [
    "case",
    ["==", ["geometry-type"], "Point"],
    "rgba(255, 0, 0, 0.8)",
    ["==", ["geometry-type"], "Circle"],
    "rgba(0, 150, 255, 0.3)",
    "transparent",
  ],
  "circle-stroke-color": [
    "case",
    ["==", ["geometry-type"], "Point"],
    "rgba(200, 0, 0, 1)",
    ["==", ["geometry-type"], "Circle"],
    "rgba(0, 100, 200, 0.8)",
    "transparent",
  ],
  "circle-stroke-width": 2,
  "stroke-color": [
    "case",
    ["==", ["geometry-type"], "LineString"],
    "rgba(0, 200, 0, 0.9)",
    ["==", ["geometry-type"], "Polygon"],
    "rgba(255, 165, 0, 0.9)",
    "rgba(100, 100, 100, 0.8)",
  ],
  "stroke-width": [
    "case",
    ["==", ["geometry-type"], "LineString"],
    4,
    ["==", ["geometry-type"], "Polygon"],
    3,
    2,
  ],
  "fill-color": [
    "case",
    ["==", ["geometry-type"], "Polygon"],
    "rgba(255, 165, 0, 0.3)",
    "transparent",
  ],
};

const AppWebGL: FC = () => {
  const mapRef = useMapRef();


  return (
    <Stack alignItems="center" component={Paper} spacing={2} padding={2}>
      <OpenLayersMap
        ref={mapRef}
        wrapperProps={{
          style: {
            height: "500px",
            width: "100%",
          },
        }}
      >
        <MapView defaultZoom={13} />
        <MapWebGLTileLayer source={source} />

        {/* WebGL Vector Layer for High-Performance Rendering - All Features */}
        <MapWebGLVectorLayer layerId={"webglVectorLayer"} style={vectorLayerStyle}>
          <CircleFeature
            center={{ long: 34.79, lat: 32.087 }}
            radius={500}
            onClick={(feature, event) => {
              console.log("Circle clicked:", feature, event);
            }}
          />

          <PointFeature
            coordinates={{
              long: 34.78,
              lat: 32.085,
            }}
            onClick={(feature, event) => {
              console.log("Point clicked:", feature, event);
            }}
          />

          <LineStringFeature
            coordinates={[
              { long: 34.78, lat: 32.085 },
              { long: 34.785, lat: 32.09 },
              { long: 34.79, lat: 32.087 },
              { long: 34.79972, lat: 32.088 },
            ]}
            onClick={(feature, event) => {
              console.log("Line clicked:", feature, event);
            }}
          />

          <PolygonFeature
            coordinates={[
              { long: 34.775, lat: 32.083 },
              { long: 34.788, lat: 32.083 },
              { long: 34.788, lat: 32.092 },
              { long: 34.775, lat: 32.092 },
            ]}
            onClick={(feature, event) => {
              console.log("Polygon clicked:", feature, event);
            }}
          />
        </MapWebGLVectorLayer>
      </OpenLayersMap>
    </Stack>
  );
};

export default AppWebGL;
