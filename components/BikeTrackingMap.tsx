import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvent } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatCurrency } from '../lib/utils/formatters';

interface BikeLocation {
  lat: number;
  lng: number;
  timestamp: number;
}

interface TrackedBike {
  bikeId: number;
  userId: number;
  rentalId: number;
  location: {
    lat: number;
    lng: number;
  };
  speed: number;
  battery: number;
  isMoving: boolean;
  path: BikeLocation[];
}

// Componente para atualizar o centro do mapa
function CenterUpdater({ position }: { position: LatLngTuple }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);
  
  return null;
}

interface BikeTrackingMapProps {
  bike: TrackedBike;
  destinationPoint?: {
    lat: number;
    lng: number;
    name: string;
  };
  onSetDestination?: (destination: { lat: number; lng: number }) => void;
  width?: string;
  height?: string;
}

const BikeTrackingMap: React.FC<BikeTrackingMapProps> = ({
  bike,
  destinationPoint,
  onSetDestination,
  width = '100%',
  height = '300px'
}) => {
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  
  // Ícone de bicicleta personalizado
  const bikeIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position: relative;">
        <div style="background-color: #2196F3; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
          <span class="material-icons" style="color: white;">pedal_bike</span>
        </div>
        <div style="position: absolute; top: -5px; right: -5px; background-color: ${bike.battery < 20 ? '#F44336' : bike.battery < 50 ? '#FFC107' : '#4CAF50'}; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; font-size: 8px; color: white; display: flex; align-items: center; justify-content: center;">
          ${Math.round(bike.battery)}%
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  
  // Ícone de destino personalizado
  const destinationIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="flex items-center justify-center">
        <div class="w-10 h-10 bg-secondary rounded-full flex items-center justify-center border-2 border-white shadow-lg">
          <span class="material-icons text-white">flag</span>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  
  // Handler para clique no mapa (define destino)
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onSetDestination) {
      onSetDestination({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  };
  
  // Componente para capturar eventos de clique no mapa
  const MapClickHandler = () => {
    useMapEvent('click', handleMapClick);
    return null;
  };
  
  // Converte path para formato do Polyline
  const pathPoints: LatLngTuple[] = bike.path.map(point => [point.lat, point.lng]);
  
  // Bicicleta como posição atual para centralizar o mapa
  const currentPosition: LatLngTuple = [bike.location.lat, bike.location.lng];
  
  return (
    <div style={{ width, height }} className="rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={currentPosition}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        ref={setMapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Linha do caminho percorrido */}
        {pathPoints.length > 1 && (
          <Polyline
            positions={pathPoints}
            color="#2196F3"
            weight={4}
            opacity={0.7}
          />
        )}
        
        {/* Marcador da bicicleta */}
        <Marker
          position={currentPosition}
          icon={bikeIcon}
        />
        
        {/* Marcador do destino, se houver */}
        {destinationPoint && (
          <Marker
            position={[destinationPoint.lat, destinationPoint.lng]}
            icon={destinationIcon}
          />
        )}
        
        {/* Mantém o mapa centralizado na bicicleta */}
        <CenterUpdater position={currentPosition} />
      </MapContainer>
      
      {/* Painel de informações */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white dark:bg-zinc-800 bg-opacity-90 dark:bg-opacity-90 rounded-lg p-3 shadow-lg">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Velocidade</span>
            <span className="font-medium">{bike.speed} km/h</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Bateria</span>
            <span className="font-medium">{Math.round(bike.battery)}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
            <span className="font-medium">{bike.isMoving ? 'Em movimento' : 'Parado'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeTrackingMap;