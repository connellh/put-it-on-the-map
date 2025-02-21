import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import {Protocol} from "pmtiles";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const lng = 139.753;
  const lat = 35.6844;
  const zoom = 14;
  const API_KEY = 'YOUR_MAPTILER_API_KEY_HERE';

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) {
      console.error('Map container not found');
      return;
    }
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles",protocol.tile);
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://demotiles.maplibre.org/style.json`,
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on("load", () => {
      map.current!.addSource("pmtiles", {
        "type": "vector",
        "tiles": [
          "https://d3hdg4cvisrlfm.cloudfront.net/{z}/{x}/{y}.mvt"
        ],
      })
    })
  }, [API_KEY, lng, lat, zoom]);

  return (
    <div className="map-wrap">
      <h1>CHANGE TEST: {new Date().toLocaleTimeString()}</h1> {/* Obvious change */}
      <div ref={mapContainer} className="map" />
    </div>
  );
}
