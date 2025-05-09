import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bike, Plan, Station, Rental } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/Header";
import Map from "@/components/Map";
import BottomSheet from "@/components/BottomSheet";
import ProfileMenu from "@/components/ProfileMenu";
import StationCard from "@/components/StationCard";
import BikeCard from "@/components/BikeCard";
import RentalPlan from "@/components/RentalPlan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { toast } = useToast();
  
  // UI state
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'stations' | 'stationDetail' | 'bikeDetail' | 'bookingConfirmation'>('stations');
  const [searchTerm, setSearchTerm] = useState("");
  
  // Application state
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentRental, setCurrentRental] = useState<Rental | null>(null);

  // Fetch all stations
  const { 
    data: stations = [], 
    isLoading: stationsLoading 
  } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });

  // Fetch bikes for selected station
  const { 
    data: bikes = [], 
    isLoading: bikesLoading 
  } = useQuery<Bike[]>({
    queryKey: ['/api/stations', selectedStation?.id, 'bikes'],
    enabled: !!selectedStation,
  });

  // Rental plans
  const plans: Plan[] = [
    {
      id: 1,
      name: "Por Hora",
      price: "R$ 8,00/hora",
      description: "Perfeito para passeios curtos pela cidade.",
      popular: false,
    },
    {
      id: 2,
      name: "Diária",
      price: "R$ 30,00/dia",
      description: "Use a bicicleta por até 24 horas.",
      popular: true,
    },
    {
      id: 3,
      name: "Semanal",
      price: "R$ 120,00/semana",
      description: "Para quem quer explorar a cidade por mais tempo.",
      popular: false,
    },
  ];

  // Create rental mutation
  const createRentalMutation = useMutation({
    mutationFn: async (rentalData: { bikeId: number, stationId: number, planId: number }) => {
      const response = await apiRequest('POST', '/api/rentals', rentalData);
      return response.json();
    },
    onSuccess: (data: Rental) => {
      setCurrentRental(data);
      setCurrentView('bookingConfirmation');
      toast({
        title: "Reserva confirmada!",
        description: "Sua bicicleta está aguardando por você.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao fazer reserva",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter stations based on search term
  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle station selection
  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setCurrentView('stationDetail');
    setSheetExpanded(true);
  };

  // Handle bike selection
  const handleBikeSelect = (bike: Bike) => {
    setSelectedBike(bike);
    setSelectedPlan(plans[1]); // Default to daily plan
    setCurrentView('bikeDetail');
  };

  // Handle rental plan selection
  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  // Book a bike
  const handleBookBike = () => {
    if (!selectedBike || !selectedStation || !selectedPlan) {
      toast({
        title: "Erro ao fazer reserva",
        description: "Por favor, selecione uma bicicleta e um plano.",
        variant: "destructive",
      });
      return;
    }

    createRentalMutation.mutate({
      bikeId: selectedBike.id,
      stationId: selectedStation.id,
      planId: selectedPlan.id,
    });
  };

  // Book any available bike
  const handleBookAnyBike = () => {
    if (!selectedStation || !bikes.length) {
      toast({
        title: "Erro ao fazer reserva",
        description: "Não há bicicletas disponíveis nesta estação.",
        variant: "destructive",
      });
      return;
    }

    setSelectedBike(bikes[0]);
    setSelectedPlan(plans[1]); // Default to daily plan
    setCurrentView('bikeDetail');
  };

  // Navigate back functions
  const goBackToStations = () => {
    setSelectedStation(null);
    setCurrentView('stations');
  };

  const goBackToStationDetail = () => {
    setCurrentView('stationDetail');
  };

  // Function to navigate to station (would integrate with maps in real implementation)
  const navigateToStation = () => {
    if (!selectedStation) return;
    
    toast({
      title: "Navegação iniciada",
      description: `Navegando para ${selectedStation.name}`,
    });
  };

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <div className="h-screen overflow-hidden relative">
      <Header onProfileClick={toggleProfileMenu} />
      
      <Map onStationSelect={handleStationSelect} />
      
      <BottomSheet expanded={sheetExpanded} onToggle={() => setSheetExpanded(!sheetExpanded)}>
        {currentView === 'stations' && (
          <div className="px-4 pb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Estações próximas</h2>
              <p className="text-gray-600 dark:text-gray-300">Encontre bicicletas disponíveis perto de você</p>
            </div>
            
            <div className="relative mb-4">
              <span className="material-icons absolute left-3 top-2.5 text-gray-400">search</span>
              <Input 
                type="text" 
                placeholder="Buscar estação..." 
                className="w-full rounded-full bg-gray-100 dark:bg-gray-700 pl-10 pr-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {stationsLoading ? (
              <div className="flex justify-center py-6">
                <span className="material-icons animate-spin">sync</span>
              </div>
            ) : filteredStations.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Nenhuma estação encontrada
              </div>
            ) : (
              filteredStations.map(station => (
                <StationCard 
                  key={station.id} 
                  station={station} 
                  onClick={handleStationSelect} 
                />
              ))
            )}
          </div>
        )}

        {currentView === 'stationDetail' && selectedStation && (
          <div className="px-4 pb-8">
            <div className="flex items-center mb-4">
              <button className="mr-2 text-zinc-800 dark:text-white" onClick={goBackToStations}>
                <span className="material-icons">arrow_back</span>
              </button>
              <h2 className="text-2xl font-semibold">{selectedStation.name}</h2>
            </div>
            
            <img 
              src={selectedStation.imageUrl} 
              alt={selectedStation.name} 
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg">Detalhes da Estação</h3>
                <span className={`${selectedStation.availableBikes > 0 ? 'text-secondary' : 'text-destructive'} font-semibold`}>
                  {selectedStation.availableBikes} bicicletas disponíveis
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Endereço:</span>
                  <span>{selectedStation.address}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Horário:</span>
                  <span>{selectedStation.openingTime} - {selectedStation.closingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Distância:</span>
                  <span>{selectedStation.distance} ({selectedStation.walkingTime})</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Bicicletas Disponíveis</h3>
              {bikesLoading ? (
                <div className="flex justify-center py-4">
                  <span className="material-icons animate-spin">sync</span>
                </div>
              ) : bikes.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Não há bicicletas disponíveis
                </div>
              ) : (
                <div className="space-y-2">
                  {bikes.map(bike => (
                    <BikeCard 
                      key={bike.id} 
                      bike={bike} 
                      onClick={handleBikeSelect} 
                    />
                  ))}
                </div>
              )}
            </div>
            
            {selectedStation.availableBikes > 0 && (
              <Button 
                className="w-full bg-primary hover:bg-zinc-800 text-white dark:bg-accent dark:hover:bg-blue-600 font-medium rounded-xl py-6" 
                onClick={handleBookAnyBike}
              >
                Reservar Qualquer Bicicleta
              </Button>
            )}
          </div>
        )}

        {currentView === 'bikeDetail' && selectedBike && (
          <div className="px-4 pb-8">
            <div className="flex items-center mb-4">
              <button className="mr-2 text-zinc-800 dark:text-white" onClick={goBackToStationDetail}>
                <span className="material-icons">arrow_back</span>
              </button>
              <h2 className="text-2xl font-semibold">{selectedBike.name}</h2>
            </div>
            
            <img 
              src={selectedBike.imageUrl} 
              alt={selectedBike.name} 
              className="w-full h-56 object-cover rounded-xl mb-4"
            />
            
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Especificações</h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tipo:</span>
                  <span>{selectedBike.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Aro:</span>
                  <span>{selectedBike.wheelSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Marchas:</span>
                  <span>{selectedBike.gears}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Última revisão:</span>
                  <span>{selectedBike.lastMaintenance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Estado:</span>
                  <span className="text-secondary font-medium">{selectedBike.condition}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Planos de Aluguel</h3>
              <div className="space-y-3">
                {plans.map(plan => (
                  <RentalPlan 
                    key={plan.id} 
                    plan={plan} 
                    selected={selectedPlan?.id === plan.id}
                    onClick={handlePlanSelect} 
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-primary hover:bg-zinc-800 text-white dark:bg-accent dark:hover:bg-blue-600 font-medium rounded-xl py-6"
                onClick={handleBookBike}
                disabled={createRentalMutation.isPending}
              >
                {createRentalMutation.isPending ? (
                  <span className="material-icons animate-spin mr-2">sync</span>
                ) : null}
                Alugar Agora
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border border-gray-300 dark:border-gray-600 text-zinc-800 dark:text-white font-medium rounded-xl py-6"
                onClick={goBackToStationDetail}
              >
                Voltar para Estação
              </Button>
            </div>
          </div>
        )}

        {currentView === 'bookingConfirmation' && currentRental && (
          <div className="px-4 pb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary bg-opacity-10 rounded-full mb-4">
                <span className="material-icons text-4xl text-secondary">check_circle</span>
              </div>
              <h2 className="text-2xl font-semibold mb-1">Reserva Confirmada!</h2>
              <p className="text-gray-600 dark:text-gray-300">Sua bicicleta está aguardando por você</p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <div className="flex items-center mb-4">
                <span className="material-icons text-accent mr-3">pedal_bike</span>
                <div>
                  <h3 className="font-medium">{currentRental.bikeName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentRental.stationName}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Plano:</span>
                  <span>{currentRental.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Início:</span>
                  <span>{currentRental.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Término:</span>
                  <span>{currentRental.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Valor:</span>
                  <span className="font-semibold">{currentRental.price}</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 flex items-center">
                <div className="bg-primary dark:bg-accent text-white rounded-lg py-2 px-3 mr-3">
                  <span className="material-icons">qr_code_2</span>
                </div>
                <div>
                  <p className="font-medium">Código de Desbloqueio</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Escaneie no totem da estação</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-primary hover:bg-zinc-800 text-white dark:bg-accent dark:hover:bg-blue-600 font-medium rounded-xl py-6"
                onClick={navigateToStation}
              >
                Navegar até a Estação
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border border-gray-300 dark:border-gray-600 text-zinc-800 dark:text-white font-medium rounded-xl py-6"
                onClick={() => setCurrentView('stations')}
              >
                Voltar para Estações
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
      
      <ProfileMenu isOpen={profileMenuOpen} onClose={() => setProfileMenuOpen(false)} />
    </div>
  );
}
