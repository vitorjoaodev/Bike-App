import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Station } from '../shared/schema';
import { formatCurrency } from '../lib/utils/formatters';

// Define ícones personalizados para o mapa
const createStationIcon = (availableBikes: number) => {
  const color = availableBikes === 0 ? '#E53935' : 
                availableBikes < 3 ? '#FFA726' : '#27AE60';
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="station-marker drop-shadow-lg" style="background-color: ${color}; position: relative; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white;">
        <span>${availableBikes}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

// Componente para exibir a localização atual do usuário
function LocationMarker({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  useEffect(() => {
    map.locate({ setView: true, maxZoom: 15 });
    
    map.on('locationfound', (e) => {
      setPosition(e.latlng);
      onLocationFound(e.latlng.lat, e.latlng.lng);
    });
    
    return () => {
      map.off('locationfound');
    };
  }, [map, onLocationFound]);
  
  return position === null ? null : (
    <>
      <Marker 
        position={position}
        icon={L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="flex items-center justify-center">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg pulse-animation">
                <span class="material-icons text-white">person_pin_circle</span>
              </div>
            </div>
          `,
          iconSize: [48, 48],
          iconAnchor: [24, 48],
        })}
      >
        <Popup>Você está aqui</Popup>
      </Marker>
      <Circle 
        center={position} 
        radius={300} 
        pathOptions={{ 
          fillColor: '#2196F3', 
          fillOpacity: 0.1, 
          color: '#2196F3', 
          weight: 1,
        }} 
      />
    </>
  );
}

// Componente para controle do mapa
function MapController({ 
  mapRef, 
  setMapRef 
}: { 
  mapRef: L.Map | null, 
  setMapRef: React.Dispatch<React.SetStateAction<L.Map | null>> 
}) {
  return (
    <MapContainer
      center={[-23.550520, -46.633308]} // Centro de São Paulo
      zoom={13}
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      zoomControl={false}
      ref={setMapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

interface EnhancedMapProps {
  stations: Station[];
  onStationSelect: (station: Station) => void;
}

export default function EnhancedMap({ stations, onStationSelect }: EnhancedMapProps) {
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  useEffect(() => {
    // Limpa marcadores anteriores
    markersRef.current.forEach(marker => {
      if (marker && mapRef) {
        marker.remove();
      }
    });
    markersRef.current = [];
    
    // Adiciona novos marcadores
    if (mapRef && stations.length > 0) {
      const bounds = L.latLngBounds([]);
      
      stations.forEach((station) => {
        const marker = L.marker([Number(station.lat), Number(station.lng)], {
          icon: createStationIcon(station.availableBikes)
        }).addTo(mapRef);
        
        marker.on('click', () => {
          onStationSelect(station);
        });
        
        bounds.extend([Number(station.lat), Number(station.lng)]);
        markersRef.current.push(marker);
      });
      
      if (bounds.isValid()) {
        mapRef.fitBounds(bounds, { padding: [50, 50] });
      }
    }
    
    return () => {
      markersRef.current.forEach(marker => {
        if (marker && mapRef) {
          marker.remove();
        }
      });
    };
  }, [mapRef, stations, onStationSelect]);
  
  const handleLocationFound = (lat: number, lng: number) => {
    if (mapRef) {
      mapRef.setView([lat, lng], 15);
    }
  };
  
  return (
    <div className="h-full w-full">
      <MapController mapRef={mapRef} setMapRef={setMapRef} />
      {mapRef && <LocationMarker onLocationFound={handleLocationFound} />}
      
      {/* Botões de controle */}
      <div className="absolute bottom-28 right-4 z-[1000] flex flex-col space-y-3">
        <button 
          className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center"
          onClick={() => mapRef?.zoomIn()}
        >
          <span className="material-icons">add</span>
        </button>
        <button 
          className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center"
          onClick={() => mapRef?.zoomOut()}
        >
          <span className="material-icons">remove</span>
        </button>
        <button 
          className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center"
          onClick={() => mapRef?.locate({ setView: true, maxZoom: 15 })}
        >
          <span className="material-icons text-secondary">my_location</span>
        </button>
      </div>
    </div>
  );
}