import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from "pmtiles";
import {useMap} from "@/components/MapSources.ts";

export interface MapProps {
  selectedYear: number;
}

export default function Map(props: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const zoom = 14;

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) {
      console.error('Map container not found');
      return;
    }

    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://demotiles.maplibre.org/style.json`,
      center: [-82.96875, 37.71024],
      zoom: zoom,
    });

    map.current.on("load", () => {
      // Add the vector tile source
      const mapControl = useMap({currentMapObject: map.current!});
      mapControl.enableLayersAndSources();
      map.current!.setCenter([-82.96875, 37.71024]); // Center from tile.json
      map.current!.setZoom(7); // Ensure visibility
      map.current!.setFilter('states_population-layer', ['==', ['get', 'Year'], String(props.selectedYear)]);
      console.log(map.current!.getStyle().layers);
    });
  }, [zoom]);

  useEffect(() => {
    // Ensure that the map is loaded before applying the filter
    if (map.current && map.current.isStyleLoaded()) {
      // Update the filter whenever the selected year changes
      map.current.setFilter('states_population-layer', [
        '==',
        ['get', 'Year'],
        String(props.selectedYear),
      ]);
    }
  }, [props.selectedYear]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
