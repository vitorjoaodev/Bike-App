import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { log } from './vite';

// Armazena as localizações das bicicletas com timestamp
const bikeLocations: Record<number, { 
  lat: number; 
  lng: number; 
  speed: number;
  battery: number;
  timestamp: number;
  userId: number;
}> = {};

// Armazena conexões WebSocket
const clients: WebSocket[] = [];

// Gera coordenadas simuladas para as bicicletas
function generateSimulatedLocation(bikeId: number) {
  // Coordenadas centrais de São Paulo com pequeno desvio aleatório
  const baseLat = -23.55;
  const baseLng = -46.63;
  
  // Desvio aleatório para simular movimento
  const latOffset = (Math.random() - 0.5) * 0.02;
  const lngOffset = (Math.random() - 0.5) * 0.02;
  
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset,
    speed: Math.floor(Math.random() * 15) + 5,  // 5-20 km/h
    battery: Math.floor(Math.random() * 50) + 50,  // 50-100%
    timestamp: Date.now(),
    userId: 1  // Por simplicidade, sempre associamos ao usuário ID 1
  };
}

// Configura o servidor WebSocket
export function setupWebSocketServer(server: http.Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  log('WebSocket server initialized', 'websocket');
  
  wss.on('connection', (ws: WebSocket) => {
    log('Client connected', 'websocket');
    
    // Adiciona o cliente à lista
    clients.push(ws);
    
    // Envia o estado atual quando o cliente se conecta
    const currentState = JSON.stringify({
      type: 'bikeLocations',
      bikes: bikeLocations
    });
    ws.send(currentState);
    
    // Remove o cliente quando a conexão é fechada
    ws.on('close', () => {
      log('Client disconnected', 'websocket');
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });
    
    // Lida com mensagens do cliente
    ws.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Lida com solicitação de rastreamento
        if (data.type === 'requestTracking' && data.bikeId) {
          const bikeId = data.bikeId;
          
          // Inicia rastreamento se não existir
          if (!bikeLocations[bikeId]) {
            bikeLocations[bikeId] = generateSimulatedLocation(bikeId);
            log(`Started tracking bike ${bikeId}`, 'websocket');
          }
          
          // Responde com confirmação
          ws.send(JSON.stringify({
            type: 'trackingStarted',
            bikeId,
            location: bikeLocations[bikeId]
          }));
        }
        
        // Lida com solicitação para parar rastreamento
        if (data.type === 'stopTracking' && data.bikeId) {
          const bikeId = data.bikeId;
          
          if (bikeLocations[bikeId]) {
            delete bikeLocations[bikeId];
            log(`Stopped tracking bike ${bikeId}`, 'websocket');
            
            // Responde com confirmação
            ws.send(JSON.stringify({
              type: 'trackingStopped',
              bikeId
            }));
          }
        }
      } catch (error) {
        log(`Error processing message: ${error}`, 'websocket');
      }
    });
  });
  
  // Inicia o loop de atualização de localização
  startLocationUpdates();
  
  return wss;
}

// Atualiza periodicamente as localizações e envia para todos os clientes
function startLocationUpdates() {
  setInterval(() => {
    // Atualiza as localizações de todas as bicicletas rastreadas
    for (const bikeId in bikeLocations) {
      const currentLocation = bikeLocations[bikeId];
      
      // Simula movimento
      const latOffset = (Math.random() - 0.5) * 0.001; // Movimento pequeno
      const lngOffset = (Math.random() - 0.5) * 0.001;
      
      bikeLocations[bikeId] = {
        ...currentLocation,
        lat: currentLocation.lat + latOffset,
        lng: currentLocation.lng + lngOffset,
        speed: Math.floor(Math.random() * 15) + 5,  // 5-20 km/h
        battery: Math.max(0, currentLocation.battery - (Math.random() * 0.5)),
        timestamp: Date.now()
      };
    }
    
    // Prepara a mensagem
    const updateMessage = JSON.stringify({
      type: 'locationUpdate',
      bikes: bikeLocations,
      timestamp: Date.now()
    });
    
    // Envia para todos os clientes conectados
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(updateMessage);
      }
    });
  }, 2000); // Atualiza a cada 2 segundos
}