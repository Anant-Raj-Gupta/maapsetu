"use client";

import { useState } from "react";
import { agraDemoData, DemoStop } from "@/lib/agra-demo-data";
import { generateLmoRoute } from "@/lib/dynamic-routing";
import dynamic from "next/dynamic";

// Dynamically import Leaflet map to avoid server-side rendering errors with the window object
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">Loading map...</div>
});

export function ClusterMapModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [routeStops, setRouteStops] = useState<DemoStop[]>([]);
  const [selectedStartId, setSelectedStartId] = useState<string>("");

  const handleOpenAndGenerate = () => {
    setIsOpen(true);
    generateRoute();
  };

  const generateRoute = () => {
    // Generate route from the demo data
    const newRoute = generateLmoRoute(agraDemoData, 7, selectedStartId || undefined);
    setRouteStops(newRoute);
    setSelectedStartId(""); // clear selection after generating
  };

  const googleMapsUrl = routeStops.length > 0
    ? `https://www.google.com/maps/dir/${routeStops.map(s => `${s.lat},${s.lng}`).join('/')}`
    : "#";

  return (
    <>
      <button 
        onClick={handleOpenAndGenerate}
        className="btn bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Clustered Location
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--navy)]">Dynamic Map Clustering (Agra)</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-auto flex flex-col md:flex-row gap-6">
              
              <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 relative min-h-[400px] overflow-hidden z-0">
                <LeafletMap routeStops={routeStops} allStops={agraDemoData} />
                
                {/* Legend overlay */}
                <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded shadow text-xs border border-gray-200 z-[1000] pointer-events-none">
                  <div className="flex items-center gap-2 mb-1"><div className="w-4 h-4 rounded-full bg-[#ff9933] text-white flex items-center justify-center font-bold text-[10px]">1</div> Start Point</div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-4 h-4 rounded-full bg-[#138808] text-white flex items-center justify-center font-bold text-[10px]">#</div> Route Stop</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div> Unassigned</div>
                </div>
              </div>
              
              <div className="w-full md:w-80 flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Generated Route ({routeStops.length} stops)</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {routeStops.map((stop, index) => (
                      <div key={stop.id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm text-sm">
                        <div className="font-semibold text-[var(--navy)]">
                          {index + 1}. {stop.shopName}
                          {index === 0 && <span className="ml-2 text-xs bg-[var(--saffron)] text-white px-1.5 py-0.5 rounded">START</span>}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">Lat: {stop.lat}, Lng: {stop.lng}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto space-y-3">
                  <div>
                    <label className="text-xs text-[var(--navy)] font-semibold mb-1 block">Pick Next Start Point</label>
                    <select 
                      className="field w-full text-sm"
                      value={selectedStartId}
                      onChange={(e) => setSelectedStartId(e.target.value)}
                    >
                      <option value="">-- Random Start --</option>
                      {routeStops.map((stop, i) => (
                        <option key={stop.id} value={stop.id}>
                          {i + 1}. {stop.shopName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={generateRoute}
                    className="w-full btn btn-primary py-2 flex justify-center items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    {selectedStartId ? "Route from Selection" : "Reset Route"}
                  </button>
                  
                  <a 
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full btn bg-blue-600 hover:bg-blue-700 text-white py-2 flex justify-center items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                    Open in Google Maps
                  </a>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
