import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { Station } from '@/types';

// Estilos personalizados do mapa para um visual mais moderno e vibrante
const mapStyles = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#a3daff" }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f0f7e9" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#ffd05b" }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#f99b2a" },
      { "weight": 0.8 }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#d7d7d7" }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      { "color": "#c1e2a3" }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "color": "#a3d99c" }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#447a2e" }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffcbd3" }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#444444" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#000000" }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#666666" }
    ]
  }
];

// Opções do mapa
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

// Localização inicial (Centro de São Paulo)
const center = {
  lat: -23.5505,
  lng: -46.6333,
};

const options = {
  styles: mapStyles,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  mapTypeControlOptions: {
    style: 2, // DROPDOWN_MENU
    position: 1, // TOP_LEFT
  },
  streetViewControlOptions: {
    position: 9, // RIGHT_CENTER
  },
  zoomControlOptions: {
    position: 9, // RIGHT_CENTER
  },
  fullscreenControlOptions: {
    position: 3, // TOP_RIGHT
  }
};

type GoogleMapComponentProps = {
  stations: Station[];
  onStationSelect: (station: Station) => void;
  selectedBike?: {
    id: number;
    location: { lat: number; lng: number };
    isMoving: boolean;
  } | null;
  showDirections?: boolean;
};

export default function GoogleMapComponent({ 
  stations, 
  onStationSelect, 
  selectedBike = null,
  showDirections = false 
}: GoogleMapComponentProps) {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Localizar o usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Obter direções se uma bicicleta estiver selecionada e showDirections for true
  useEffect(() => {
    if (selectedBike && userLocation && showDirections) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: userLocation,
          destination: { lat: selectedBike.location.lat, lng: selectedBike.location.lng },
          travelMode: google.maps.TravelMode.BICYCLING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Directions request failed: ${status}`);
          }
        }
      );
    }
  }, [selectedBike, userLocation, showDirections]);

  // Callback para quando o mapa é carregado
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Limpar referência quando desmontado
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleMapLoad = (map: google.maps.Map) => {
    onLoad(map);
    
    // Adicionar um efeito de suavização quando o mapa é carregado
    map.setOptions({
      gestureHandling: 'greedy', // Permite scroll mais fácil no mapa
      minZoom: 10,
      maxZoom: 20
    });
  };

  console.log("API Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  
  return (
    <LoadScript googleMapsApiKey="AIzaSyC5ixXOxTc9wIJ4VaaDmOhN3HAJMRee9yA">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedBike ? selectedBike.location : userLocation || center}
        zoom={14}
        options={options}
        onLoad={handleMapLoad}
        onUnmount={onUnmount}
      >
        {/* Marcador do usuário */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: '/assets/user-location-marker.svg',
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12)
            }}
            animation={window.google.maps.Animation.DROP}
            title="Sua localização"
          />
        )}
        
        {/* Marcadores das estações */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={{ 
              lat: typeof station.lat === 'string' ? parseFloat(station.lat) : station.lat, 
              lng: typeof station.lng === 'string' ? parseFloat(station.lng) : station.lng 
            }}
            onClick={() => {
              setSelectedStation(station);
              onStationSelect(station);
            }}
            icon={{
              url: '/assets/bike-station-marker.svg',
              scaledSize: new window.google.maps.Size(38, 38),
              anchor: new window.google.maps.Point(19, 38),
              labelOrigin: new window.google.maps.Point(19, -10)
            }}
            label={{
              text: station.name,
              color: '#333333',
              fontSize: '11px',
              fontWeight: 'bold'
            }}
            animation={window.google.maps.Animation.DROP}
          />
        ))}
        
        {/* Janela de informações da estação selecionada */}
        {selectedStation && (
          <InfoWindow
            position={{ 
              lat: typeof selectedStation.lat === 'string' ? parseFloat(selectedStation.lat) : selectedStation.lat, 
              lng: typeof selectedStation.lng === 'string' ? parseFloat(selectedStation.lng) : selectedStation.lng 
            }}
            onCloseClick={() => setSelectedStation(null)}
          >
            <div className="p-3 max-w-xs">
              <h3 className="font-bold text-gray-900 text-lg mb-1">{selectedStation.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedStation.address}</p>
              
              <div className="flex justify-between items-center bg-gray-50 rounded-md p-2 mb-2">
                <div className="text-sm">
                  <div className="font-medium text-green-600">Bikes disponíveis</div>
                  <div className="text-2xl font-bold">{selectedStation.availableBikes}</div>
                </div>
                <div className="text-sm text-right">
                  <div className="font-medium text-blue-600">Vagas livres</div>
                  <div className="text-2xl font-bold">{selectedStation.totalDocks - selectedStation.availableBikes}</div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mb-2">
                <div>Horário: {selectedStation.openingTime} - {selectedStation.closingTime}</div>
                <div>{selectedStation.distance} ({selectedStation.walkingTime})</div>
              </div>
              
              <button 
                onClick={() => onStationSelect(selectedStation)}
                className="w-full mt-1 px-4 py-2 bg-secondary text-white font-medium rounded-md hover:bg-secondary/90 transition-colors"
              >
                Selecionar esta estação
              </button>
            </div>
          </InfoWindow>
        )}
        
        {/* Marcador da bicicleta selecionada */}
        {selectedBike && (
          <Marker
            position={selectedBike.location}
            icon={{
              url: selectedBike.isMoving 
                ? '/assets/bike-moving-marker.svg' 
                : '/assets/bike-stopped-marker.svg',
              scaledSize: new window.google.maps.Size(42, 42),
              anchor: new window.google.maps.Point(21, 21)
            }}
            animation={selectedBike.isMoving ? window.google.maps.Animation.BOUNCE : undefined}
            title={selectedBike.isMoving ? "Bicicleta em movimento" : "Bicicleta parada"}
          />
        )}
        
        {/* Renderizar rotas */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: '#27AE60',
                strokeWeight: 5,
                strokeOpacity: 0.8,
                zIndex: 1
              },
              suppressMarkers: true,
              markerOptions: {
                zIndex: 2
              }
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}