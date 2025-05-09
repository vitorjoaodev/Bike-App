import { useEffect, useState, useCallback } from "react";
import { Station } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issue
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom bike station icon
const BikeStationIcon = (availableBikes: number) => L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 rounded-full ${availableBikes > 0 ? 'bg-secondary' : 'bg-destructive'} 
           flex items-center justify-center text-white font-medium shadow-lg transform transition-transform hover:scale-110">
        ${availableBikes}
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// Component to recenter map on user location
function LocationMarker({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 15 });
    
    const handleLocationFound = (e: L.LocationEvent) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationFound(e.latlng.lat, e.latlng.lng);
    };

    map.on('locationfound', handleLocationFound);

    return () => {
      map.off('locationfound', handleLocationFound);
    };
  }, [map, onLocationFound]);

  return position === null ? null : (
    <Marker 
      position={position} 
    >
      <Popup>Você está aqui</Popup>
    </Marker>
  );
}

// Map Controller component
function MapController({ mapRef, setMapRef }: { mapRef: L.Map | null, setMapRef: React.Dispatch<React.SetStateAction<L.Map | null>> }) {
  const map = useMap();
  
  useEffect(() => {
    setMapRef(map);
  }, [map, setMapRef]);
  
  return null;
}

type MapProps = {
  onStationSelect: (station: Station) => void;
};

export default function Map({ onStationSelect }: MapProps) {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  // São Paulo coordinates
  const saoPaulo: [number, number] = [-23.550520, -46.633308];
  
  const { data: stations = [] } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });

  const handleLocationFound = useCallback((lat: number, lng: number) => {
    setUserLocation({ lat, lng });
  }, []);

  const centerOnUserLocation = useCallback(() => {
    if (userLocation && mapRef) {
      mapRef.setView([userLocation.lat, userLocation.lng], 15, {
        animate: true,
        duration: 1
      });
    } else if (mapRef) {
      mapRef.locate({ setView: true, maxZoom: 15 });
    }
  }, [userLocation, mapRef]);

  return (
    <div className="relative h-full w-full">
      <MapContainer 
        center={saoPaulo} 
        zoom={13} 
        className="map-container"
      >
        <MapController mapRef={mapRef} setMapRef={setMapRef} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationMarker onLocationFound={handleLocationFound} />
        
        {stations.map(station => {
          // Ensure lat and lng are converted to numbers
          const lat = typeof station.lat === 'string' ? parseFloat(station.lat) : station.lat;
          const lng = typeof station.lng === 'string' ? parseFloat(station.lng) : station.lng;
          
          return (
            <Marker 
              key={station.id}
              position={[lat, lng]} 
              icon={BikeStationIcon(station.availableBikes)}
              eventHandlers={{
                click: () => onStationSelect(station)
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong>{station.name}</strong><br/>
                  {station.availableBikes} bicicletas disponíveis
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <div className="fixed right-4 bottom-32 md:bottom-24 z-10">
        <button 
          onClick={centerOnUserLocation}
          className="bg-white dark:bg-zinc-800 text-secondary hover:text-white hover:bg-secondary shadow-lg rounded-full p-3 transition-colors duration-300"
        >
          <span className="material-icons">my_location</span>
        </button>
      </div>
    </div>
  );
}
