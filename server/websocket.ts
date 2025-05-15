import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { log } from './vite';

interface BikeLocation {
  bikeId: number;
  lat: number;
  lng: number;
  speed: number;
  battery: number;
  timestamp: number;
}

interface TrackedBike {
  bikeId: number;
  userId: number;
  rentalId: number;
  startLocation: { lat: number; lng: number };
  lastLocation: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  battery: number;
  speed: number;
  isMoving: boolean;
  lastUpdated: number;
  path: Array<{ lat: number; lng: number; timestamp: number }>;
}

// Registro de bicicletas sendo rastreadas
const trackedBikes = new Map<number, TrackedBike>();

// Mapa de conexões de clientes por ID de usuário
const clients = new Map<number, Set<any>>();

// Definir intervalos de tempo
const UPDATE_INTERVAL = 2000; // 2 segundos
const SIMULATION_INTERVAL = 1000; // 1 segundo

export function setupWebSocketServer(server: http.Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  log('WebSocket server initialized', 'websocket');
  
  wss.on('connection', (ws: any) => {
    log('Client connected', 'websocket');
    let userId: number | null = null;
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Autenticação do cliente
        if (data.type === 'auth') {
          userId = data.userId;
          
          // Registra o cliente
          if (!clients.has(userId)) {
            clients.set(userId, new Set());
          }
          clients.get(userId)?.add(ws);
          
          log(`User ${userId} authenticated`, 'websocket');
          
          // Envia confirmação de autenticação
          ws.send(JSON.stringify({ 
            type: 'auth_success',
            userId
          }));
          
          // Envia dados de todas as bicicletas que o usuário está rastreando
          const userBikes = Array.from(trackedBikes.values())
            .filter(bike => bike.userId === userId);
          
          if (userBikes.length > 0) {
            ws.send(JSON.stringify({
              type: 'tracking_data',
              bikes: userBikes
            }));
          }
        }
        
        // Iniciar rastreamento de bicicleta
        else if (data.type === 'start_tracking') {
          if (!userId) {
            ws.send(JSON.stringify({ 
              type: 'error',
              message: 'Not authenticated'
            }));
            return;
          }
          
          const { bikeId, rentalId, startLocation } = data;
          
          // Verificar se a bicicleta já está sendo rastreada
          if (trackedBikes.has(bikeId)) {
            // Atualiza o rastreamento existente
            const existingTracking = trackedBikes.get(bikeId)!;
            existingTracking.userId = userId;
            existingTracking.rentalId = rentalId;
            
            log(`Updated tracking for bike ${bikeId} by user ${userId}`, 'websocket');
          } else {
            // Inicia um novo rastreamento
            trackedBikes.set(bikeId, {
              bikeId,
              userId,
              rentalId,
              startLocation,
              lastLocation: startLocation,
              battery: Math.floor(Math.random() * 30) + 70, // 70-100%
              speed: 0,
              isMoving: false,
              lastUpdated: Date.now(),
              path: [{ ...startLocation, timestamp: Date.now() }]
            });
            
            log(`Started tracking bike ${bikeId} for user ${userId}`, 'websocket');
          }
          
          // Envia confirmação de início de rastreamento
          ws.send(JSON.stringify({ 
            type: 'tracking_started',
            bikeId
          }));
        }
        
        // Parar rastreamento de bicicleta
        else if (data.type === 'stop_tracking') {
          if (!userId) {
            ws.send(JSON.stringify({ 
              type: 'error',
              message: 'Not authenticated'
            }));
            return;
          }
          
          const { bikeId } = data;
          
          // Verifica se o usuário tem permissão para parar o rastreamento
          const bike = trackedBikes.get(bikeId);
          if (bike && bike.userId === userId) {
            trackedBikes.delete(bikeId);
            
            // Notifica o cliente que o rastreamento foi interrompido
            ws.send(JSON.stringify({ 
              type: 'tracking_stopped',
              bikeId
            }));
            
            log(`Stopped tracking bike ${bikeId} for user ${userId}`, 'websocket');
          } else {
            ws.send(JSON.stringify({ 
              type: 'error',
              message: 'Unauthorized to stop tracking for this bike'
            }));
          }
        }
        
        // Definir destino da bicicleta (para simulação)
        else if (data.type === 'set_destination') {
          if (!userId) {
            ws.send(JSON.stringify({ 
              type: 'error',
              message: 'Not authenticated'
            }));
            return;
          }
          
          const { bikeId, destination } = data;
          
          // Verifica se o usuário tem permissão para definir o destino
          const bike = trackedBikes.get(bikeId);
          if (bike && bike.userId === userId) {
            bike.destination = destination;
            bike.isMoving = true;
            
            // Notifica o cliente que o destino foi definido
            ws.send(JSON.stringify({ 
              type: 'destination_set',
              bikeId,
              destination
            }));
            
            log(`Set destination for bike ${bikeId}`, 'websocket');
          } else {
            ws.send(JSON.stringify({ 
              type: 'error',
              message: 'Unauthorized to set destination for this bike'
            }));
          }
        }
      } catch (e) {
        log(`Error processing message: ${e}`, 'websocket');
        ws.send(JSON.stringify({ 
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });
    
    // Tratamento de desconexão
    ws.on('close', () => {
      if (userId) {
        // Remove este cliente do mapa de clientes
        const userClients = clients.get(userId);
        if (userClients) {
          userClients.delete(ws);
          if (userClients.size === 0) {
            clients.delete(userId);
          }
        }
      }
      log('Client disconnected', 'websocket');
    });
  });
  
  // Inicia o loop de simulação de movimento
  startSimulation();
  
  return wss;
}

// Simula o movimento das bicicletas rastreadas
function startSimulation() {
  setInterval(() => {
    for (const [bikeId, bike] of trackedBikes.entries()) {
      if (bike.isMoving && bike.destination) {
        // Calcula a nova posição com base no destino
        const newLocation = simulateMovement(bike.lastLocation, bike.destination);
        
        // Atualiza a velocidade (entre 5 e 15 km/h)
        bike.speed = Math.floor(Math.random() * 10) + 5;
        
        // Diminui a bateria gradualmente
        bike.battery = Math.max(0, bike.battery - (Math.random() * 0.2));
        
        // Atualiza a localização
        bike.lastLocation = newLocation;
        bike.path.push({ ...newLocation, timestamp: Date.now() });
        bike.lastUpdated = Date.now();
        
        // Verifica se chegou ao destino
        const distance = calculateDistance(newLocation, bike.destination);
        if (distance < 0.05) { // 50 metros ou menos
          bike.isMoving = false;
          bike.speed = 0;
          log(`Bike ${bikeId} reached destination`, 'websocket');
        }
      } else {
        // Bicicleta parada, apenas atualiza o timestamp
        bike.lastUpdated = Date.now();
        bike.speed = 0;
      }
    }
  }, SIMULATION_INTERVAL);
  
  // Envia atualizações para os clientes
  setInterval(() => {
    // Para cada usuário com clientes conectados
    for (const [userId, userClients] of clients.entries()) {
      // Encontra as bicicletas que pertencem a esse usuário
      const userBikes = Array.from(trackedBikes.values())
        .filter(bike => bike.userId === userId);
      
      if (userBikes.length > 0) {
        // Prepara a mensagem com dados de localização
        const updateMessage = JSON.stringify({
          type: 'location_update',
          bikes: userBikes.map(bike => ({
            bikeId: bike.bikeId,
            location: bike.lastLocation,
            speed: bike.speed,
            battery: bike.battery,
            isMoving: bike.isMoving,
            timestamp: bike.lastUpdated
          }))
        });
        
        // Envia para todos os clientes deste usuário
        for (const client of userClients) {
          client.send(updateMessage);
        }
      }
    }
  }, UPDATE_INTERVAL);
}

// Simula o movimento entre dois pontos
function simulateMovement(start: { lat: number; lng: number }, destination: { lat: number; lng: number }): { lat: number; lng: number } {
  const distance = calculateDistance(start, destination);
  
  // Se estiver muito perto do destino, retorna o destino
  if (distance < 0.05) {
    return destination;
  }
  
  // Calcula um incremento de movimento (velocidade)
  // Velocidade média de uma bicicleta: ~15km/h = ~0.0042km/s = ~0.000001º/s
  // Com intervalo de 1s, o incremento será pequeno
  const moveFactor = 0.00001;
  
  // Calcula a direção como um vetor normalizado
  const direction = {
    lat: (destination.lat - start.lat) / distance,
    lng: (destination.lng - start.lng) / distance
  };
  
  // Calcula a nova posição
  return {
    lat: start.lat + direction.lat * moveFactor,
    lng: start.lng + direction.lng * moveFactor
  };
}

// Calcula a distância aproximada entre dois pontos (em km)
// Usando a fórmula de Haversine
function calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLng = deg2rad(point2.lng - point1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}