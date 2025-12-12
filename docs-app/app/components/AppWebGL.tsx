"use client";

import {
  CircleFeature,
  LineStringFeature,
  MapTileLayer,
  MapVectorLayer,
  OpenLayersMap,
  PointFeature,
  PolygonFeature,
  ReactMapOverlay,
  reactIconToSrc,
  useMapRef, MapWebGLTileLayer,
} from "@mixelburg/react-ol";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { Circle, Fill, Icon, Stroke, Style } from "ol/style";
import { FC, useState } from "react";
import { FaCar } from "react-icons/fa";
import DataTileSource from "ol/source/DataTile";

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

const AppWebGL: FC = () => {
  const mapRef = useMapRef();

  // Overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  const carCoordinates = { long: 34.79972, lat: 32.088 };

  return (
    <Stack alignItems="center" component={Paper} spacing={2} padding={2}>
      <OpenLayersMap
        ref={mapRef}
        defaultZoom={13}
        wrapperProps={{
          style: {
            height: "500px",
            width: "100%",
          },
        }}
      >
        <MapWebGLTileLayer source={source} />

        {/* Layer 1: Car and Circle */}
        <MapVectorLayer layerId={"carCircleLayer"}>
          <PointFeature
            onClick={(feature, event) => {
              console.log("Car clicked:", feature, event);
              setShowOverlay(true);
            }}
            coordinates={carCoordinates}
            style={
              new Style({
                image: new Icon({
                  src: reactIconToSrc(
                    <FaCar
                      style={{
                        color: "blue",
                      }}
                    />,
                  ),
                  scale: 1,
                }),
              })
            }
          />

          <CircleFeature
            center={{ long: 34.79, lat: 32.087 }}
            radius={500}
            style={
              new Style({
                stroke: new Stroke({
                  color: "purple",
                  width: 2,
                }),
              })
            }
            hoverStyle={
              new Style({
                stroke: new Stroke({
                  color: "purple",
                  width: 2,
                }),
                fill: new Fill({
                  color: "rgba(128, 0, 128, 0.2)",
                }),
              })
            }
            onClick={(feature, event) => {
              console.log("Circle clicked:", feature, event);
            }}
          />
        </MapVectorLayer>

        {/* Layer 2: Other Geometry Features */}
        <MapVectorLayer layerId={"geometryLayer"}>
          <PointFeature
            coordinates={{
              long: 34.78,
              lat: 32.085,
            }}
            style={
              new Style({
                image: new Circle({
                  radius: 8,
                  fill: new Fill({
                    color: "blue",
                  }),
                }),
              })
            }
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
            style={
              new Style({
                stroke: new Stroke({
                  color: "red",
                  width: 3,
                }),
              })
            }
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
            style={
              new Style({
                stroke: new Stroke({
                  color: "green",
                  width: 2,
                }),
                fill: new Fill({
                  color: "rgba(0, 255, 0, 0.2)",
                }),
              })
            }
            onClick={(feature, event) => {
              console.log("Polygon clicked:", feature, event);
            }}
            onMouseEnter={(feature, event) => {
              console.log("Polygon mouse enter:", feature, event);
            }}
            onMouseExit={(feature, event) => {
              console.log("Polygon mouse exit:", feature, event);
            }}
          />
        </MapVectorLayer>

        {/* Overlay for Car */}
        {showOverlay && (
          <ReactMapOverlay coordinates={carCoordinates}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                backgroundColor: "white",
                maxWidth: "200px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Car Information
              </Typography>
              <Typography variant="body2">
                Location: {carCoordinates.lat.toFixed(4)}, {carCoordinates.long.toFixed(4)}
              </Typography>
              <Button variant="contained" size="small" onClick={() => setShowOverlay(false)} sx={{ marginTop: 1 }}>
                Close
              </Button>
            </Paper>
          </ReactMapOverlay>
        )}
      </OpenLayersMap>
    </Stack>
  );
};

export default AppWebGL;
