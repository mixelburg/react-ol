"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Slider, Stack, Typography } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { OSM } from "ol/source";
import { Circle, Fill, Icon, Stroke, Style } from "ol/style";
import { FC, useState } from "react";
import { FaCar } from "react-icons/fa";
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
  useMapRef,
} from "react-ol";

const App: FC = () => {
  const mapRef = useMapRef();
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState({
    long: 34.7818,
    lat: 32.0853,
  });

  // Layer 1: Car and Circle
  const [showLayer1, setShowLayer1] = useState(true);
  const [showCar, setShowCar] = useState(true);
  const [showCircle, setShowCircle] = useState(true);

  // Layer 2: Other features
  const [showLayer2, setShowLayer2] = useState(true);
  const [showPoint, setShowPoint] = useState(true);
  const [showLine, setShowLine] = useState(true);
  const [showPolygon, setShowPolygon] = useState(true);

  // Overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  const carCoordinates = { long: 34.79972, lat: 32.088 };

  return (
    <Stack alignItems="center" component={Paper} spacing={2} padding={2}>
      <Stack width="100%" spacing={2}>
        <Stack direction="row">
          <Box width="100%" paddingX={2}>
            <Typography gutterBottom>Zoom: {zoom.toFixed(1)}</Typography>
            <Slider
              value={zoom}
              onChange={(_, value) => setZoom(value as number)}
              min={1}
              max={20}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box width="100%" paddingX={2}>
            <Typography gutterBottom>Longitude: {center.long.toFixed(4)}</Typography>
            <Slider
              value={center.long}
              onChange={(_, value) => setCenter({ ...center, long: value as number })}
              min={34.5}
              max={35.0}
              step={0.001}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box width="100%" paddingX={2}>
            <Typography gutterBottom>Latitude: {center.lat.toFixed(4)}</Typography>
            <Slider
              value={center.lat}
              onChange={(_, value) => setCenter({ ...center, lat: value as number })}
              min={31.8}
              max={32.3}
              step={0.001}
              valueLabelDisplay="auto"
            />
          </Box>
        </Stack>

        <Box width="100%" paddingX={2}>
          <Typography variant="h6" gutterBottom>
            Layers & Features
          </Typography>
          <SimpleTreeView defaultExpandedItems={["layer1", "layer2"]}>
            <TreeItem
              itemId="layer1"
              label={
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <span>Car & Circle Layer</span>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLayer1(!showLayer1);
                    }}
                  >
                    {showLayer1 ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </Box>
              }
            >
              <TreeItem
                itemId="car"
                label={
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <span>Car</span>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCar(!showCar);
                      }}
                    >
                      {showCar ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Box>
                }
              />
              <TreeItem
                itemId="circle"
                label={
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <span>Circle</span>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCircle(!showCircle);
                      }}
                    >
                      {showCircle ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Box>
                }
              />
            </TreeItem>

            <TreeItem
              itemId="layer2"
              label={
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <span>Geometry Layer</span>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLayer2(!showLayer2);
                    }}
                  >
                    {showLayer2 ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </Box>
              }
            >
              <TreeItem
                itemId="point"
                label={
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <span>Point</span>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPoint(!showPoint);
                      }}
                    >
                      {showPoint ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Box>
                }
              />
              <TreeItem
                itemId="line"
                label={
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <span>Line</span>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLine(!showLine);
                      }}
                    >
                      {showLine ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Box>
                }
              />
              <TreeItem
                itemId="polygon"
                label={
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <span>Polygon</span>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPolygon(!showPolygon);
                      }}
                    >
                      {showPolygon ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Box>
                }
              />
            </TreeItem>
          </SimpleTreeView>
        </Box>

        <Button
          onClick={() => {
            mapRef.current?.fitAll(200);
          }}
        >
          Fit All
        </Button>
      </Stack>

      <OpenLayersMap
        ref={mapRef}
        center={center}
        onCenterChange={setCenter}
        zoom={zoom}
        onZoomChange={setZoom}
        wrapperProps={{
          style: {
            height: "500px",
            width: "100%",
          },
        }}
      >
        <MapTileLayer source={new OSM()} />

        {/* Layer 1: Car and Circle */}
        <MapVectorLayer layerId={"carCircleLayer"} visible={showLayer1}>
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
            visible={showCar}
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
            visible={showCircle}
            onClick={(feature, event) => {
              console.log("Circle clicked:", feature, event);
            }}
          />
        </MapVectorLayer>

        {/* Layer 2: Other Geometry Features */}
        <MapVectorLayer layerId={"geometryLayer"} visible={showLayer2}>
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
            visible={showPoint}
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
            visible={showLine}
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
            visible={showPolygon}
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

export default App;
