import maplibregl from "maplibre-gl";

export enum AttributeToggleType {
  YEAR,
  MONTH,
  DAY
}

export interface CustomLayerSpecification {
  layerSpecification: maplibregl.LayerSpecification;
  attributeToggleType?: AttributeToggleType;
  filterAttributeName: string;
  filterAttributeDataType: string;
  name: string;
}


export const sources: Record<string, maplibregl.SourceSpecification> = {
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
  corruption_index_summed: {
    type: "vector",
    tiles: ["https://d3hdg4cvisrlfm.cloudfront.net/corruption_index_summed_per_capita_proportional_2/{z}/{x}/{y}.mvt"],
    minzoom: 0,
    maxzoom: 12,
  },
};

export const layers: Record<string, CustomLayerSpecification> =
  {
    "states_population-layer": {
      layerSpecification: {
        id: "states_population-layer",
        type: "circle",
        source: "states_population",
        "source-layer": "states_population", // Correctly referencing the layer in the tile
        paint: {
          "circle-color": "#ffffff", // Red color for visibility
          "circle-radius": 10, // Adjust as needed
          "circle-opacity": 1,
        },
        layout: {visibility: "none"}
      },
      name: "State populations",
      attributeToggleType: AttributeToggleType.YEAR,
      filterAttributeDataType: "string",
      filterAttributeName: "Year"
    },
    "zebra_crossings-layer": {
      layerSpecification: {
        id: "zebra_crossings-layer",
        type: "circle",
        source: "zebra_crossings",
        "source-layer": "zebra_crossings", // Correctly referencing the layer in the tile
        paint: {
          "circle-color": "#ff0000", // Red color for visibility
          "circle-radius": 10, // Adjust as needed
          "circle-opacity": 1,
        },
        layout: {visibility: "none"}
      },
      name: "Zebra crossings",
      attributeToggleType: AttributeToggleType.YEAR,
      filterAttributeDataType: "string",
      filterAttributeName: "Year"
    },
    "corruption_index-layer": {
      "layerSpecification": {
        "id": "corruption_index-layer",
        "type": "fill",  // Changed from "circle" to "fill" for polygons
        "source": "corruption_index_summed",
        "source-layer": "corruption_trends_by_state_summed",
        "paint": {
          // Fill color will vary based on the 'interest' property
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "total_interest_per_capita"],  // Get the 'interest' value from properties
            0, "#34c300",  // Light red for low interest
            1000, "#c60000"  // Dark red for high interest
          ],
          // Optional: Add opacity to make it visually distinct
          "fill-opacity": 1,  // Adjusted for polygons; tweak as needed
          // Optional: Add an outline for clarity
          "fill-outline-color": "#000000"  // Black outline to define polygon edges
        },
        "layout": {
          "visibility": "visible"
        }
      },
      name: "Corruption Index",
      attributeToggleType: AttributeToggleType.YEAR,
      filterAttributeDataType: "string",
      filterAttributeName: "year"
    }
  };
