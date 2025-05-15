import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import GoogleMapComponent from '@/components/GoogleMap';
import useBikeTracking from '@/hooks/useBikeTracking';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from '@/components/SEOHead';

export default function BikeTracking() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const bikeId = id ? parseInt(id) : undefined;
  const { bike, error, isConnecting, setDestination } = useBikeTracking(bikeId);
  const [showDirections, setShowDirections] = useState(false);
  const [stations, setStations] = useState([]);
  
  useEffect(() => {
    // Carregar estações apenas uma vez
    fetch('/api/stations')
      .then(res => res.json())
      .then(data => setStations(data))
      .catch(err => console.error('Error loading stations:', err));
  }, []);

  // Lidar com erros de carregamento
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-zinc-900 px-4">
        <SEOHead 
          title="Erro de Rastreamento | BikeShare SP"
          description="Ocorreu um erro ao rastrear sua bicicleta."
        />
        <div className="text-red-500 text-6xl mb-4">
          <span className="material-icons" style={{ fontSize: '5rem' }}>error</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Erro de conexão</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-secondary hover:bg-secondary/90 text-white"
        >
          Tentar novamente
        </Button>
        <Button 
          variant="outline"
          className="mt-4"
          onClick={() => setLocation('/')}
        >
          Voltar para a página inicial
        </Button>
      </div>
    );
  }

  // Carregando
  if (isConnecting || !bike) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-900 px-4 pt-16">
        <SEOHead 
          title="Rastreando Bicicleta | BikeShare SP"
          description="Aguarde enquanto conectamos à sua bicicleta."
        />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Conectando à sua bicicleta...</h1>
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="flex justify-between gap-2">
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-12 w-1/3" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-900">
      <SEOHead 
        title={`Rastreando Bicicleta #${bike.bikeId} | BikeShare SP`}
        description="Acompanhe em tempo real a localização da sua bicicleta."
      />
      
      {/* Cabeçalho */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-zinc-900 z-10 pt-16 pb-2 px-4 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">Rastreando Bicicleta #{bike.bikeId}</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setLocation('/')}
          >
            <span className="material-icons">close</span>
          </Button>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <span className="material-icons text-secondary mr-1" style={{ fontSize: '1rem' }}>speed</span>
            <span>{bike.speed} km/h</span>
          </div>
          
          <div className="flex items-center">
            <span className="material-icons text-secondary mr-1" style={{ fontSize: '1rem' }}>bolt</span>
            <span>Bateria: {bike.battery}%</span>
          </div>
          
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full ${bike.isMoving ? 'bg-green-500' : 'bg-gray-400'} mr-1`}></span>
            <span>{bike.isMoving ? 'Em movimento' : 'Parada'}</span>
          </div>
        </div>
      </div>
      
      {/* Mapa */}
      <div className="flex-1 mt-[100px] relative">
        <GoogleMapComponent 
          stations={stations}
          onStationSelect={() => {}}
          selectedBike={{
            id: bike.bikeId,
            location: bike.location,
            isMoving: bike.isMoving
          }}
          showDirections={showDirections}
        />
      </div>
      
      {/* Controles */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button 
            onClick={() => setShowDirections(!showDirections)}
            className={`${showDirections ? 'bg-green-600' : 'bg-secondary'} text-white`}
            variant="default"
          >
            <span className="material-icons mr-2">directions</span>
            {showDirections ? 'Ocultar Rota' : 'Mostrar Rota'}
          </Button>
          
          <Button 
            onClick={() => alert('Reportar problema com a bicicleta #' + bike.bikeId)}
            variant="outline"
          >
            <span className="material-icons mr-2">report_problem</span>
            Reportar Problema
          </Button>
        </div>
        
        <Button 
          onClick={() => {
            if (confirm('Deseja realmente finalizar o aluguel?')) {
              setLocation('/');
            }
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          <span className="material-icons mr-2">stop_circle</span>
          Finalizar Aluguel
        </Button>
      </div>
    </div>
  );
}