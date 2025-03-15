import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from "pmtiles";
import { useMap } from "@/components/useMap.ts";
import { AttributeToggleType } from "@/Style.ts";
import { debounce, getPopupCoordinates, throttle } from "@/components/utils.ts";

export interface MapProps {
  selectedYear: number;
}

export interface MapControl { enableLayersAndSources: any; getAllLayers: any; }

export default function Map(props: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const mapControl = useRef<MapControl | null>(null);
  const zoom = 14;

  useEffect(() => {
    if (!mapContainer.current) {
      console.error('Map container not found');
      return;
    }

    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://demotiles.maplibre.org/style.json`,
      center: [-82.96875, 37.71024],
      zoom: zoom,
      scrollZoom: true
    });

    map.current.on("load", () => {
      mapControl.current = useMap({ currentMapObject: map.current! });
      mapControl.current.enableLayersAndSources();
      map.current!.setCenter([-82.96875, 37.71024]);
      map.current!.setZoom(7);

      Object.entries(mapControl.current.getAllLayers()).forEach(([id, layer]) => {
        if (map.current!.getLayer(id)?.visibility === "visible" && layer.attributeToggleType === AttributeToggleType.YEAR) {
          map.current!.setFilter(id, ['==', ['get', layer.filterAttributeName], props.selectedYear]);
        }
      });

      const isSmallScreen = () => window.innerWidth < 768; // Mobile threshold

      const popup = new maplibregl.Popup({
        closeButton: isSmallScreen(), // Show close button on small screens
        closeOnClick: false,
        anchor: 'top',
        maxWidth: '300px',
        focusAfterOpen: false
      });

      let currentFeatureId: string | number | null = null;

      const createPopupContent = (properties: any): string => {
        const phraseInterests = typeof properties.phrase_interests_per_capita === 'string'
          ? JSON.parse(properties.phrase_interests_per_capita)
          : properties.phrase_interests_per_capita;
        const breakdown = Object.entries(phraseInterests)
          .map(([phrase, interest]) => `${phrase}: ${(interest || 0).toFixed(2)}`)
          .join('<br>');

        return `
          <div style="max-height: 200px; overflow-y: auto; padding: 5px;">
            <strong>Region: </strong>${properties.region || 'N/A'}<br>
            <strong>Total Interest (per capita normalized): </strong>${(properties.total_interest_per_capita || 0).toFixed(2)}<br>
            <strong>Year: </strong>${properties.year || 'N/A'}<br>
            <strong>Breakdown (per capita normalized):</strong><br>${breakdown || 'N/A'}
          </div>
        `;
      };

      // Large screen: Hover behavior
      const handleMouseMove = throttle((e: maplibregl.MapMouseEvent) => {
        if (isSmallScreen()) return; // Skip on small screens

        const features = e.target.queryRenderedFeatures(e.point, { layers: ['corruption_index-layer'] });
        if (features.length > 0) {
          const feature = features[0];
          const featureId = feature.id;

          if (featureId !== currentFeatureId) {
            if (popup.isOpen()) popup.remove();
            currentFeatureId = featureId;

            const coordinates = getPopupCoordinates(feature.geometry);
            const properties = feature.properties;

            if (properties) {
              const content = createPopupContent(properties);
              const element = popup.setLngLat(coordinates)
                .setHTML(content)
                .addTo(map.current!).getElement();
              element.style.color = 'black';
              if (!isSmallScreen()) {
                element.addEventListener('wheel', (event) => {
                  map.current?.scrollZoom.wheel(event);
                });
              }
            }
          }
        }
      }, 100);

      // Small screen: Click behavior
      const handleClick = (e: maplibregl.MapMouseEvent) => {
        if (!isSmallScreen()) return; // Skip on large screens

        const features = e.target.queryRenderedFeatures(e.point, { layers: ['corruption_index-layer'] });
        if (features.length > 0) {
          const feature = features[0];
          const coordinates = getPopupCoordinates(feature.geometry);
          const properties = feature.properties;

          if (properties) {
            if (popup.isOpen() && currentFeatureId === feature.id) {
              popup.remove(); // Toggle close if clicking same feature
              currentFeatureId = null;
            } else {
              currentFeatureId = feature.id;
              const content = createPopupContent(properties);
              const element = popup.setLngLat(coordinates)
                .setHTML(content)
                .addTo(map.current!).getElement();
              element.style.color = 'black';
              if (!isSmallScreen()) {
                element.addEventListener('wheel', (event) => {
                  map.current?.scrollZoom.wheel(event);
                });
              }
            }
          }
        }
      };

      const handleMouseLeave = debounce((e: maplibregl.MapMouseEvent) => {
        if (isSmallScreen()) return; // Skip on small screens

        const features = e.target.queryRenderedFeatures(e.point, { layers: ['corruption_index-layer'] });
        if (features.length === 0 && popup.isOpen()) {
          currentFeatureId = null;
          popup.remove();
        }
      }, 200);

      map.current!.on('mousemove', 'corruption_index-layer', handleMouseMove);
      map.current!.on('click', 'corruption_index-layer', handleClick);
      map.current!.on('mousemove', handleMouseLeave); // Global mousemove for leave
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [zoom]);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded() && mapControl.current) {
      Object.entries(mapControl.current!.getAllLayers()).filter(([_, layer]) => {
        return layer.attributeToggleType === AttributeToggleType.YEAR
      }).forEach(([id, layer]) => {
        if (map.current!.getLayer(id)?.visibility === "visible") {
          map.current!.setFilter(id, ['==', ['get', layer.filterAttributeName], props.selectedYear]);
        }
      });
    }
  }, [props.selectedYear]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
