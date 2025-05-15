import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { Station } from '@shared/schema';

// Estilos personalizados do mapa para um visual mais moderno
const mapStyles = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#e9e9e9" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f5f5f5" },
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 29 },
      { "weight": 0.2 }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 18 }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 16 }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f5f5f5" },
      { "lightness": 21 }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "color": "#dedede" },
      { "lightness": 21 }
    ]
  }
];

// Opções do mapa
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Localização inicial (Centro de São Paulo)
const center = {
  lat: -23.5505,
  lng: -46.6333,
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
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

  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedBike ? selectedBike.location : userLocation || center}
        zoom={14}
        options={options}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Marcador do usuário */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        )}
        
        {/* Marcadores das estações */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={{ lat: parseFloat(station.lat), lng: parseFloat(station.lng) }}
            onClick={() => {
              setSelectedStation(station);
              onStationSelect(station);
            }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new google.maps.Size(36, 36),
            }}
          />
        ))}
        
        {/* Janela de informações da estação selecionada */}
        {selectedStation && (
          <InfoWindow
            position={{ lat: parseFloat(selectedStation.lat), lng: parseFloat(selectedStation.lng) }}
            onCloseClick={() => setSelectedStation(null)}
          >
            <div className="p-2">
              <h3 className="font-bold text-gray-900">{selectedStation.name}</h3>
              <p className="text-sm text-gray-600">{selectedStation.address}</p>
              <div className="mt-2 text-sm">
                <span className="font-medium">Bikes disponíveis:</span> {selectedStation.availableBikes}
              </div>
              <div className="text-sm">
                <span className="font-medium">Vagas disponíveis:</span> {selectedStation.totalDocks - selectedStation.availableBikes}
              </div>
              <button 
                onClick={() => onStationSelect(selectedStation)}
                className="mt-2 px-3 py-1 bg-secondary text-white text-sm rounded-md hover:bg-secondary/90"
              >
                Selecionar
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
                ? 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(40, 40),
            }}
            animation={selectedBike.isMoving ? google.maps.Animation.BOUNCE : undefined}
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
              },
              suppressMarkers: true,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}