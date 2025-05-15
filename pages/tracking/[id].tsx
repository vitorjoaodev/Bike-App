import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSimpleBikeTracking } from '../../client/src/hooks/useSimpleBikeTracking';

// Importamos o componente do mapa dinamicamente para evitar problemas com SSR
const BikeTrackingMap = dynamic(
  () => import('../../components/BikeTrackingMap'),
  { ssr: false }
);

const BikeTrackingPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const bikeId = id ? parseInt(id as string, 10) : 0;
  
  const [isLoading, setIsLoading] = useState(true);
  const [bikeInfo, setBikeInfo] = useState({
    id: bikeId,
    name: 'Bicicleta E-101',
    type: 'Elétrica',
    stationName: 'Estação Paulista'
  });
  
  // Hook de rastreamento
  const { isConnected, error, trackedBikes, startTracking, stopTracking } = useSimpleBikeTracking();
  
  // Bicicleta sendo rastreada atualmente
  const currentBike = trackedBikes.find(bike => bike.bikeId === bikeId);
  
  // Inicia o rastreamento quando a página carrega
  useEffect(() => {
    if (isConnected && bikeId) {
      startTracking(bikeId);
      setTimeout(() => setIsLoading(false), 1500); // Simula um tempo de carregamento
    }
  }, [isConnected, bikeId, startTracking]);
  
  // Limpa o rastreamento quando a página é fechada
  useEffect(() => {
    return () => {
      if (bikeId) {
        stopTracking(bikeId);
      }
    };
  }, [bikeId, stopTracking]);
  
  const handleFinishTracking = () => {
    stopTracking(bikeId);
    router.push('/');
  };
  
  // Para os dados de mapa no formato esperado
  const mapBikeData = currentBike ? {
    bikeId: currentBike.bikeId,
    userId: 1,
    rentalId: 1,
    location: {
      lat: currentBike.lat,
      lng: currentBike.lng
    },
    speed: currentBike.speed,
    battery: currentBike.battery,
    isMoving: true,
    path: currentBike.path
  } : null;
  
  return (
    <>
      <Head>
        <title>Rastreando Bicicleta | BikeShare SP</title>
        <meta name="description" content="Acompanhe o rastreamento em tempo real da sua bicicleta alugada." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
        {/* Header */}
        <header className="bg-white dark:bg-zinc-800 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="material-icons text-secondary mr-2">arrow_back</span>
              <h1 className="text-xl font-semibold">Rastreamento</h1>
            </Link>
            
            {isConnected ? (
              <div className="flex items-center text-green-500">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm">Conectado</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span className="text-sm">Desconectado</span>
              </div>
            )}
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          {/* Carregando */}
          {isLoading && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 text-center shadow-md">
              <div className="inline-block w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg">Conectando ao rastreamento da bicicleta...</p>
            </div>
          )}
          
          {/* Erro */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md mb-6">
              <p className="font-medium">Erro no rastreamento</p>
              <p>{error}</p>
            </div>
          )}
          
          {/* Informações da bicicleta e mapa */}
          {!isLoading && currentBike && mapBikeData && (
            <div className="mb-6">
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                      <span className="material-icons text-secondary">pedal_bike</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{bikeInfo.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{bikeInfo.type} • {bikeInfo.stationName}</p>
                    </div>
                  </div>
                  
                  {/* Dados do status em tempo real */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-100 dark:bg-zinc-700 rounded-lg p-4 text-center">
                      <div className="text-secondary text-sm uppercase font-medium">Velocidade</div>
                      <div className="text-2xl font-bold">{currentBike.speed} km/h</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-zinc-700 rounded-lg p-4 text-center">
                      <div className="text-secondary text-sm uppercase font-medium">Bateria</div>
                      <div className="text-2xl font-bold">{Math.round(currentBike.battery)}%</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-zinc-700 rounded-lg p-4 text-center">
                      <div className="text-secondary text-sm uppercase font-medium">Status</div>
                      <div className="text-2xl font-bold">Ativo</div>
                    </div>
                  </div>
                  
                  {/* Mapa de rastreamento */}
                  <div className="rounded-xl overflow-hidden h-72 sm:h-96 mb-6">
                    <BikeTrackingMap 
                      bike={mapBikeData}
                      height="100%"
                    />
                  </div>
                  
                  {/* Informações e dicas */}
                  <div className="bg-gray-100 dark:bg-zinc-700 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Rastreamento em tempo real:</span> Você está recebendo atualizações de localização, velocidade e bateria da sua bicicleta em tempo real.
                    </p>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      className="bg-secondary hover:bg-green-600 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center shadow-md transition duration-300"
                      onClick={handleFinishTracking}
                    >
                      <span className="material-icons mr-2">stop</span>
                      Finalizar Rastreamento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Sem dados de bicicleta */}
          {!isLoading && !currentBike && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 text-center shadow-md">
              <div className="inline-block w-12 h-12 text-gray-400 dark:text-gray-500 mb-4">
                <span className="material-icons text-5xl">pedal_bike</span>
              </div>
              <p className="text-lg mb-4">Não há dados de rastreamento disponíveis para esta bicicleta.</p>
              <Link 
                href="/"
                className="bg-secondary hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center shadow-md transition duration-300"
              >
                <span className="material-icons mr-1 text-sm">arrow_back</span>
                Voltar para Estações
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default BikeTrackingPage;