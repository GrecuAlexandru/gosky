"use client"; // Required for Next.js App Router

import React from "react";
import Map, { Layer, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Replace with your actual Mapbox public access token
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYW5kcmVpc2Fsb21pYSIsImEiOiJjbTRlODg3enMwdnUwMmlzYXVqMzh3bXRzIn0.BXOCj0oiZqI2naZHOGBuLw";

// Hardcoded test data (latitude and longitude for Bucharest)
const testEvents = [
  { latitude: 44.4268, longitude: 26.1025 }, // City Center
  { latitude: 44.429, longitude: 26.103 },  // Close to city center
  { latitude: 44.44, longitude: 26.12 },    // North Bucharest
  { latitude: 44.423, longitude: 26.09 },   // South Bucharest
  { latitude: 44.41, longitude: 26.10 },    // West Bucharest
];

// Convert test data to GeoJSON format
const geoJsonData = {
  type: "FeatureCollection",
  features: testEvents.map((event) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [event.longitude, event.latitude],
    },
  })),
};

export default function EventHeatmap() {
  return (
    <Map
      initialViewState={{
        longitude: 26.1025, // Bucharest Center
        latitude: 44.4268,
        zoom: 12,
      }}
      style={{ width: "100%", height: "600px" }}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v10"
    >
      {/* Heatmap Source and Layer */}
      <Source id="event-heatmap" type="geojson" data={geoJsonData}>
        <Layer
          id="heatmap-layer"
          type="heatmap"
          paint={{
            "heatmap-intensity": 1,
            "heatmap-radius": 25,
            "heatmap-opacity": 0.7,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0)",
              0.2,
              "rgb(103,169,207)",
              0.4,
              "rgb(209,229,240)",
              0.6,
              "rgb(253,219,199)",
              0.8,
              "rgb(239,138,98)",
              1,
              "rgb(178,24,43)",
            ],
          }}
        />
      </Source>
    </Map>
  );
}