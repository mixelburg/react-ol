"use client";

import {Box, FormControlLabel, Paper, Slider, Stack, Switch, Typography} from "@mui/material";
import {OSM} from "ol/source";
import {Circle, Fill, Stroke, Style, Text} from "ol/style";
import {FC, useMemo, useState} from "react";
import {MapTileLayer, MapVectorLayer, OpenLayersMap, PointFeature, useMapRef,} from "@mixelburg/react-ol";
import CircleStyle from "ol/style/Circle";

// Generate random points in Israel area
const generateRandomPoints = (count: number) => {
  const points = [];
  const baseLocations = [
    { lat: 32.0853, long: 34.7818, name: "Tel Aviv Area" },
    { lat: 31.7683, long: 35.2137, name: "Jerusalem Area" },
    { lat: 32.7940, long: 34.9896, name: "Haifa Area" },
    { lat: 31.2530, long: 34.7915, name: "Beer Sheva Area" },
  ];

  for (let i = 0; i < count; i++) {
    const base = baseLocations[Math.floor(Math.random() * baseLocations.length)];
    points.push({
      id: i,
      lat: base.lat + (Math.random() - 0.5) * 0.5,
      long: base.long + (Math.random() - 0.5) * 0.5,
      value: Math.floor(Math.random() * 100),
    });
  }
  return points;
};

const AppClustering: FC = () => {
  const mapRef = useMapRef();
  const [zoom, setZoom] = useState(8);
  const [center] = useState({
    long: 34.8516,
    lat: 31.9,
  });

  const [clusteringEnabled, setClusteringEnabled] = useState(true);
  const [clusterDistance, setClusterDistance] = useState(40);
  const [pointCount, setPointCount] = useState(100);

  // Generate points based on count
  const points = useMemo(() => generateRandomPoints(pointCount), [pointCount]);

  // Style for individual points
  const pointStyle = new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color: "#3b82f6" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
  });

  return (
    <Stack alignItems="center" component={Paper} spacing={2} padding={2}>
      <Stack width="100%" spacing={2}>
        <Typography variant="h6">Clustering Configuration</Typography>

        <FormControlLabel
          control={
            <Switch
              checked={clusteringEnabled}
              onChange={(e) => setClusteringEnabled(e.target.checked)}
            />
          }
          label="Enable Clustering"
        />

        <Box width="100%" paddingX={2}>
          <Typography gutterBottom>
            Cluster Distance: {clusterDistance}px
          </Typography>
          <Slider
            value={clusterDistance}
            onChange={(_, value) => setClusterDistance(value as number)}
            min={10}
            max={150}
            step={10}
            valueLabelDisplay="auto"
            disabled={!clusteringEnabled}
          />
        </Box>

        <Box width="100%" paddingX={2}>
          <Typography gutterBottom>
            Number of Points: {pointCount}
          </Typography>
          <Slider
            value={pointCount}
            onChange={(_, value) => setPointCount(value as number)}
            min={10}
            max={500}
            step={10}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box width="100%" paddingX={2}>
          <Typography gutterBottom>Zoom: {zoom.toFixed(1)}</Typography>
          <Slider
            value={zoom}
            onChange={(_, value) => setZoom(value as number)}
            min={7}
            max={15}
            step={0.1}
            valueLabelDisplay="auto"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          Zoom in to see clusters break apart into individual points. Adjust the
          cluster distance to control how aggressively points are grouped.
        </Typography>
      </Stack>

      <OpenLayersMap
        ref={mapRef}
        center={center}
        zoom={zoom}
        onZoomChange={setZoom}
        wrapperProps={{ style: { width: "100%", height: "600px" } }}
      >
        <MapTileLayer source={new OSM()} />

        <MapVectorLayer
          layerId="points"
          clustering={
            clusteringEnabled
              ? {
                  enabled: true,
                  distance: clusterDistance,
                }
              : undefined
          }
          style={(feature) => {
            const size = feature.get("features")?.length;
            if (size === 1) {
              return pointStyle
            }
            return new Style({
              image: new CircleStyle({
                radius: 10,
                fill: new Fill({
                  color: "tomato",
                }),
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({
                  color: '#fff',
                }),
              }),
            });
          }}
        >
          {points.map((point) => (
            <PointFeature
              key={point.id}
              coordinates={{ lat: point.lat, long: point.long }}
            />
          ))}
        </MapVectorLayer>
      </OpenLayersMap>
    </Stack>
  );
};

export default AppClustering;

