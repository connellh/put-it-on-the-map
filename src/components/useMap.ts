import maplibregl from "maplibre-gl";
import {layers, sources} from "@/Style.ts";

export interface UseMapProps {
  currentMapObject: maplibregl.Map;
}

export const useMap = (props: UseMapProps) => {
  const enableLayersAndSources = () => {
    const {currentMapObject} = props;

    // Add sources first
    Object.entries(sources).forEach(([id, source]) => {
      if (!currentMapObject.getSource(id)) {
        currentMapObject.addSource(id, source);
      }
    });

    // Add layers
    Object.entries(layers).forEach(([_, layer]) => {
      if (!currentMapObject.getLayer(layer.layerSpecification.id)) {
        currentMapObject.addLayer(layer.layerSpecification);
      }
    });
  };

  const getAllLayers = () => {
    return layers;
  };

  return {enableLayersAndSources, getAllLayers};
};
