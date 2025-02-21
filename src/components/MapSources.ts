import maplibregl from "maplibre-gl";

export interface UseMapProps {
  currentMapObject: maplibregl.Map;
}

export const useMap = (props: UseMapProps) => {
  const sources: Record<string, maplibregl.SourceSpecification> = {
    pmtiles: {
      type: "vector",
      tiles: ["https://d3hdg4cvisrlfm.cloudfront.net/example/{z}/{x}/{y}.mvt"],
      minzoom: 0,
      maxzoom: 7,
    },
    states_population: {
      type: "vector",
      tiles: ["https://d3hdg4cvisrlfm.cloudfront.net/states_population_new/{z}/{x}/{y}.mvt"],
      minzoom: 0,
      maxzoom: 14,
    },
    zebra_crossings: {
      type: "vector",
      tiles: ["https://d3hdg4cvisrlfm.cloudfront.net/zebra_crossings/{z}/{x}/{y}.mvt"],
      minzoom: 0,
      maxzoom: 14,
    },
  };

  const layers: any[] = [
    // {
    //   id: "pmtiles-layer",
    //   type: "fill", // Change if needed (e.g., "line", "circle", "symbol")
    //   source: "pmtiles",
    //   "source-layer": "zcta", // Ensure this matches your tile.json
    //   paint: {
    //     "fill-color": "#ff0000", // Bright red for visibility
    //     "fill-opacity": 0.7,
    //   },
    // },
    {
      id: "states_population-layer",
      type: "circle",
      source: "states_population",
      "source-layer": "states_population", // Correctly referencing the layer in the tile
      paint: {
        "circle-color": "#ffffff", // Red color for visibility
        "circle-radius": 10, // Adjust as needed
        "circle-opacity": 1,
      },
    },
    {
      id: "zebra_crossings-layer",
      type: "circle",
      source: "zebra_crossings",
      "source-layer": "zebra_crossings", // Correctly referencing the layer in the tile
      paint: {
        "circle-color": "#ff0000", // Red color for visibility
        "circle-radius": 10, // Adjust as needed
        "circle-opacity": 1,
      },
    },
  ];

  const enableLayersAndSources = () => {
    const { currentMapObject } = props;

    // Add sources first
    Object.entries(sources).forEach(([id, source]) => {
      if (!currentMapObject.getSource(id)) {
        currentMapObject.addSource(id, source);
      }
    });

    // Add layers
    layers.forEach((layer) => {
      if (!currentMapObject.getLayer(layer.id)) {
        currentMapObject.addLayer(layer);
      }
    });
  };

  return { enableLayersAndSources };
};
