import { useEffect, useRef, useState } from "react";
import { Station } from "@/types";
import { useQuery } from "@tanstack/react-query";

type MapProps = {
  onStationSelect: (station: Station) => void;
};

export default function Map({ onStationSelect }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [key: number]: google.maps.Marker }>({});
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);

  const { data: stations = [] } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });

  useEffect(() => {
    // Initialize Google Map
    if (mapRef.current && !googleMapRef.current) {
      // São Paulo coordinates
      const saoPaulo = { lat: -23.550520, lng: -46.633308 };
      
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: saoPaulo,
        zoom: 13,
        disableDefaultUI: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            
            setUserLocation(pos);
            googleMapRef.current?.setCenter(pos);
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      }
    }
  }, []);

  // Add/update station markers when stations data changes
  useEffect(() => {
    if (!googleMapRef.current || !stations.length) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    stations.forEach(station => {
      if (!googleMapRef.current) return;

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'station-marker';
      markerElement.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full ${station.availableBikes > 0 ? 'bg-secondary' : 'bg-destructive'} 
               flex items-center justify-center text-white font-medium shadow-lg">
            ${station.availableBikes}
          </div>
          <div class="bg-white dark:bg-zinc-800 text-xs font-medium px-2 py-1 rounded mt-1 shadow">
            ${station.name.split(' ')[1]}
          </div>
        </div>
      `;

      // Create the marker
      const marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: googleMapRef.current,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
            '<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"></svg>'
          ),
          scaledSize: new google.maps.Size(1, 1),
        },
      });

      // Create overlay for custom HTML marker
      const overlay = new google.maps.OverlayView();
      overlay.setMap(googleMapRef.current);
      
      overlay.onAdd = function() {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.appendChild(markerElement);
        this.getPanes()?.overlayMouseTarget.appendChild(div);

        google.maps.event.addDomListener(div, 'click', () => {
          onStationSelect(station);
        });

        overlay.draw = function() {
          const projection = this.getProjection();
          if (!projection) return;
          
          const position = projection.fromLatLngToDivPixel(marker.getPosition() as google.maps.LatLng);
          if (!position) return;
          
          div.style.left = (position.x) + 'px';
          div.style.top = (position.y) + 'px';
        };
      };

      markersRef.current[station.id] = marker;
    });

    // Update user marker if location exists
    if (userLocation) {
      if (userMarker) {
        userMarker.setPosition(userLocation);
      } else {
        const newUserMarker = new google.maps.Marker({
          position: userLocation,
          map: googleMapRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          zIndex: 999,
        });
        setUserMarker(newUserMarker);
      }
    }
  }, [stations, onStationSelect, userLocation]);

  const centerOnUserLocation = () => {
    if (userLocation && googleMapRef.current) {
      googleMapRef.current.panTo(userLocation);
      googleMapRef.current.setZoom(15);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setUserLocation(pos);
          if (googleMapRef.current) {
            googleMapRef.current.setCenter(pos);
            googleMapRef.current.setZoom(15);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="map-container" />
      <div className="fixed right-4 bottom-32 md:bottom-24 z-10">
        <button 
          onClick={centerOnUserLocation}
          className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white shadow-lg rounded-full p-3"
        >
          <span className="material-icons">my_location</span>
        </button>
      </div>
    </div>
  );
}
