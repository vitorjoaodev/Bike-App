import { useState, useEffect, useCallback } from 'react';

interface BikeLocation {
  bikeId: number;
  lat: number;
  lng: number;
  speed: number;
  battery: number;
  timestamp: number;
  userId: number;
}

interface TrackedBike {
  bikeId: number;
  lat: number;
  lng: number;
  speed: number;
  battery: number;
  timestamp: number;
  path: { lat: number; lng: number; timestamp: number }[];
}

export function useSimpleBikeTracking() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackedBikes, setTrackedBikes] = useState<Record<number, TrackedBike>>({});

  // Inicializa a conexão WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };
    
    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('Falha na conexão WebSocket');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'locationUpdate':
            // Atualiza o estado com os dados de localização
            const newBikes: Record<number, TrackedBike> = { ...trackedBikes };
            
            // Para cada bicicleta no update
            for (const bikeId in data.bikes) {
              const bikeUpdate = data.bikes[bikeId];
              
              if (!newBikes[bikeId]) {
                // Nova bicicleta - inicializa com um caminho (path)
                newBikes[bikeId] = {
                  ...bikeUpdate,
                  path: [{ 
                    lat: bikeUpdate.lat, 
                    lng: bikeUpdate.lng, 
                    timestamp: bikeUpdate.timestamp 
                  }]
                };
              } else {
                // Bicicleta existente - atualiza e adiciona ao caminho
                const currentBike = newBikes[bikeId];
                
                // Adiciona nova posição ao path
                const updatedPath = [...currentBike.path];
                updatedPath.push({
                  lat: bikeUpdate.lat,
                  lng: bikeUpdate.lng,
                  timestamp: bikeUpdate.timestamp
                });
                
                // Limita o tamanho do path para os últimos 100 pontos
                if (updatedPath.length > 100) {
                  updatedPath.splice(0, updatedPath.length - 100);
                }
                
                newBikes[bikeId] = {
                  ...bikeUpdate,
                  path: updatedPath
                };
              }
            }
            
            setTrackedBikes(newBikes);
            break;
            
          case 'bikeLocations':
            // Estado inicial das localizações das bicicletas
            const initialBikes: Record<number, TrackedBike> = {};
            
            for (const bikeId in data.bikes) {
              const bikeData = data.bikes[bikeId];
              
              initialBikes[bikeId] = {
                ...bikeData,
                path: [{ 
                  lat: bikeData.lat, 
                  lng: bikeData.lng, 
                  timestamp: bikeData.timestamp 
                }]
              };
            }
            
            setTrackedBikes(initialBikes);
            break;
            
          case 'trackingStarted':
            // Confirma o início do rastreamento de uma bicicleta
            console.log(`Started tracking bike ${data.bikeId}`);
            break;
            
          case 'trackingStopped':
            // Remove a bicicleta rastreada
            const bikesAfterStop = { ...trackedBikes };
            delete bikesAfterStop[data.bikeId];
            setTrackedBikes(bikesAfterStop);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    setSocket(ws);
    
    // Cleanup na desmontagem
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Inicia o rastreamento de uma bicicleta
  const startTracking = useCallback((bikeId: number) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'requestTracking',
        bikeId
      }));
    } else {
      setError('WebSocket não está conectado');
    }
  }, [socket, isConnected]);
  
  // Interrompe o rastreamento de uma bicicleta
  const stopTracking = useCallback((bikeId: number) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'stopTracking',
        bikeId
      }));
    }
  }, [socket, isConnected]);

  return {
    isConnected,
    error,
    trackedBikes: Object.values(trackedBikes),
    startTracking,
    stopTracking
  };
}