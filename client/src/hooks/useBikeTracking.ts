import { useState, useEffect, useCallback } from 'react';

interface BikeLocation {
  bikeId: number;
  location: {
    lat: number;
    lng: number;
  };
  speed: number;
  battery: number;
  isMoving: boolean;
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
  path: Array<{
    lat: number;
    lng: number;
    timestamp: number;
  }>;
}

interface BikeTrackingOptions {
  userId: number;
  onLocationUpdate?: (location: BikeLocation) => void;
  onConnectionChange?: (isConnected: boolean) => void;
  onError?: (error: string) => void;
}

export function useBikeTracking(options: BikeTrackingOptions) {
  const { userId, onLocationUpdate, onConnectionChange, onError } = options;
  
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<Map<number, TrackedBike>>(new Map());
  
  // Inicializa a conexão WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      onConnectionChange?.(true);
      
      // Autenticação inicial
      ws.send(JSON.stringify({
        type: 'auth',
        userId
      }));
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      onConnectionChange?.(false);
    };
    
    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('Falha na conexão WebSocket');
      onError?.('Falha na conexão WebSocket');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'auth_success':
            console.log('Authentication successful');
            break;
          
          case 'tracking_data':
            // Atualiza o estado com os dados de bicicletas
            const newTrackingData = new Map(trackingData);
            data.bikes.forEach((bike: TrackedBike) => {
              newTrackingData.set(bike.bikeId, bike);
            });
            setTrackingData(newTrackingData);
            break;
          
          case 'location_update':
            // Atualiza o estado de localização
            const updatedTrackingData = new Map(trackingData);
            
            data.bikes.forEach((update: BikeLocation) => {
              const existing = updatedTrackingData.get(update.bikeId);
              
              if (existing) {
                existing.location = update.location;
                existing.speed = update.speed;
                existing.battery = update.battery;
                existing.isMoving = update.isMoving;
                
                // Adiciona ao histórico de caminho
                existing.path.push({
                  ...update.location,
                  timestamp: update.timestamp
                });
                
                // Limita o tamanho do histórico (mantém últimos 100 pontos)
                if (existing.path.length > 100) {
                  existing.path = existing.path.slice(-100);
                }
                
                updatedTrackingData.set(update.bikeId, existing);
              }
              
              // Chama o callback se fornecido
              onLocationUpdate?.(update);
            });
            
            setTrackingData(updatedTrackingData);
            break;
          
          case 'tracking_started':
            console.log(`Started tracking bike ${data.bikeId}`);
            break;
          
          case 'tracking_stopped':
            console.log(`Stopped tracking bike ${data.bikeId}`);
            // Remove a bicicleta dos dados de rastreamento
            const trackingDataWithoutBike = new Map(trackingData);
            trackingDataWithoutBike.delete(data.bikeId);
            setTrackingData(trackingDataWithoutBike);
            break;
          
          case 'error':
            console.error('Server error:', data.message);
            setError(data.message);
            onError?.(data.message);
            break;
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    
    setSocket(ws);
    
    // Cleanup na desmontagem
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [userId, onLocationUpdate, onConnectionChange, onError]);
  
  // Inicia o rastreamento de uma bicicleta
  const startTracking = useCallback((bikeId: number, rentalId: number, startLocation: { lat: number; lng: number }) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'start_tracking',
        bikeId,
        rentalId,
        startLocation
      }));
    } else {
      setError('WebSocket não está conectado');
      onError?.('WebSocket não está conectado');
    }
  }, [socket, isConnected, onError]);
  
  // Interrompe o rastreamento de uma bicicleta
  const stopTracking = useCallback((bikeId: number) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'stop_tracking',
        bikeId
      }));
    }
  }, [socket, isConnected]);
  
  // Define um destino para a bicicleta (para simulação)
  const setDestination = useCallback((bikeId: number, destination: { lat: number; lng: number }) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'set_destination',
        bikeId,
        destination
      }));
    }
  }, [socket, isConnected]);
  
  return {
    isConnected,
    error,
    trackingData: Array.from(trackingData.values()),
    startTracking,
    stopTracking,
    setDestination
  };
}