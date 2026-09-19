"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DemoStop } from "@/lib/agra-demo-data";

export default function LeafletMap({ 
  routeStops, 
  allStops 
}: { 
  routeStops: DemoStop[]; 
  allStops: DemoStop[] 
}) {
  const center: [number, number] = [27.1767, 78.0081];

  const createIcon = (stop: DemoStop) => {
    const routeIndex = routeStops.findIndex(rs => rs.id === stop.id);
    const isSelected = routeIndex !== -1;
    const isStart = routeIndex === 0;

    let bgColor = "#94a3b8";
    let size = 12;
    let content = "";
    let classes = "rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold";

    if (isStart) {
      bgColor = "#ff9933";
      size = 28;
      content = "1";
    } else if (isSelected) {
      bgColor = "#138808";
      size = 24;
      content = (routeIndex + 1).toString();
    }

    return L.divIcon({
      html: `<div class="${classes}" style="background-color: ${bgColor}; width: ${size}px; height: ${size}px; font-size: ${size/2}px;">${content}</div>`,
      className: "",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const polylinePositions = routeStops.map(s => [s.lat, s.lng] as [number, number]);

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {polylinePositions.length > 1 && (
        <Polyline 
          positions={polylinePositions} 
          pathOptions={{ color: "#0b3a82", weight: 3, dashArray: "5, 5" }} 
        />
      )}

      {allStops.map(stop => {
        const routeIndex = routeStops.findIndex(rs => rs.id === stop.id);
        const zIndexOffset = routeIndex === 0 ? 1000 : routeIndex !== -1 ? 500 : 0;
        
        return (
          <Marker 
            key={stop.id} 
            position={[stop.lat, stop.lng]} 
            icon={createIcon(stop)}
            zIndexOffset={zIndexOffset}
          />
        );
      })}
    </MapContainer>
  );
}
