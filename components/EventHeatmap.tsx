"use client"; // Required for Next.js App Router

import React, { useEffect, useState } from "react";
import Map, { Layer, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from "@/utils/supabase/client"; // Import Supabase client

// Replace with your actual Mapbox public access token
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYW5kcmVpc2Fsb21pYSIsImEiOiJjbTRlODg3enMwdnUwMmlzYXVqMzh3bXRzIn0.BXOCj0oiZqI2naZHOGBuLw";

export default function EventHeatmap() {
  const [geoJsonData, setGeoJsonData] = useState<any>({
    type: "FeatureCollection",
    features: [],
  });

  const supabase = createClient();

  // Fetch real event data from the database
  useEffect(() => {
    const fetchEvents = async () => {
        const { data: events, error } = await supabase
          .from("events") // Replace with your table name
          .select("latitude, longitude");

        if (error) throw error;

        // Convert fetched data to GeoJSON format
        const features = events
          .filter((event) => event.latitude && event.longitude) // Filter out incomplete data
          .map((event) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [event.longitude, event.latitude],
            },
          }));

        setGeoJsonData({
          type: "FeatureCollection",
          features,
        });
    };

    fetchEvents();
  }, [supabase]);

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
