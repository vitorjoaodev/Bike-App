import { useState, useEffect, useRef } from 'react';

type BikeLocation = {
  lat: number;
  lng: number;
  timestamp: number;
};

type TrackedBike = {
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
};

/**
 * Hook para rastreamento em tempo real de bicicletas via WebSocket
 */
export default function useBikeTracking(bikeId?: number) {
  const [bike, setBike] = useState<TrackedBike | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!bikeId) return;

    setIsConnecting(true);
    setError(null);

    // Determinar URL do WebSocket com base no ambiente
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    // Criar conexão WebSocket
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnecting(false);
      // Enviar mensagem para iniciar o rastreamento desta bicicleta específica
      ws.send(JSON.stringify({ type: 'subscribe', bikeId }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'bikeUpdate' && data.bike) {
          // Atualizar os dados da bicicleta
          setBike(data.bike);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('Erro na conexão WebSocket. Tente novamente mais tarde.');
      setIsConnecting(false);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnecting(false);
    };

    // Limpar a conexão quando o componente for desmontado
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'unsubscribe', bikeId }));
        wsRef.current.close();
      }
    };
  }, [bikeId]);

  // Função para simular um destino (ponto final da viagem)
  const setDestination = (lat: number, lng: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && bikeId) {
      wsRef.current.send(JSON.stringify({ 
        type: 'setDestination', 
        bikeId, 
        destination: { lat, lng } 
      }));
    }
  };

  return { bike, error, isConnecting, setDestination };
}