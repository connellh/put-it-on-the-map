import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
export default function Map() {
    // Type the ref as HTMLDivElement (specific to <div>) or null
    const mapContainer = useRef(null);
    const map = useRef(null);
    const lng = 139.753;
    const lat = 35.6844;
    const zoom = 14;
    const API_KEY = 'YOUR_MAPTILER_API_KEY_HERE';
    useEffect(() => {
        if (map.current)
            return; // Stops map from initializing more than once
        if (!mapContainer.current) {
            console.error('Map container not found');
            return;
        }
        map.current = new maplibregl.Map({
            container: mapContainer.current, // Now correctly typed as HTMLDivElement
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
            center: [lng, lat],
            zoom: zoom,
        });
    }, [API_KEY, lng, lat, zoom]);
    return (_jsx("div", { className: "map-wrap", children: _jsx("div", { ref: mapContainer, className: "map" }) }));
}
