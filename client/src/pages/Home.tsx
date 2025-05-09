import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bike, Plan, Station, Rental } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

import Header from "@/components/Header";
import Map from "@/components/Map";
import BottomSheet from "@/components/BottomSheet";
import ProfileMenu from "@/components/ProfileMenu";
import StationCard from "@/components/StationCard";
import BikeCard from "@/components/BikeCard";
import RentalPlan from "@/components/RentalPlan";
import ScheduleBooking from "@/components/ScheduleBooking";
import RentalForm from "@/components/RentalForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Home() {
  const { toast } = useToast();
  
  // UI state
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'stations' | 'stationDetail' | 'bikeDetail' | 'scheduleBooking' | 'bookingConfirmation' | 'rentalForm'>('stations');
  const [searchTerm, setSearchTerm] = useState("");
  const [stationViewTab, setStationViewTab] = useState<'map' | 'list'>('map');
  
  // Application state
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentRental, setCurrentRental] = useState<Rental | null>(null);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [userFormData, setUserFormData] = useState<any>(null);

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
    mutationFn: async (rentalData: { bikeId: number, stationId: number, planId: number, scheduledTime?: string }) => {
      const response = await apiRequest('POST', '/api/rentals', rentalData);
      return response.json();
    },
    onSuccess: (data: Rental) => {
      setCurrentRental(data);
      setCurrentView('bookingConfirmation');
      toast({
        title: "Reserva confirmada!",
        description: "Sua bicicleta está aguardando por você."
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

  // Show booking schedule
  const handleShowSchedule = () => {
    if (!selectedBike || !selectedStation || !selectedPlan) {
      toast({
        title: "Erro ao agendar",
        description: "Por favor, selecione uma bicicleta e um plano.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentView('scheduleBooking');
  };

  // Book a bike immediately
  const handleBookBike = () => {
    if (!selectedBike || !selectedStation || !selectedPlan) {
      toast({
        title: "Erro ao fazer reserva",
        description: "Por favor, selecione uma bicicleta e um plano.",
        variant: "destructive",
      });
      return;
    }

    // Mostrar o formulário de aluguel para coletar informações do usuário
    setCurrentView('rentalForm');
  };
  
  // Finaliza o aluguel após o preenchimento do formulário
  const handleRentalFormSubmit = (formData: any) => {
    setUserFormData(formData);
    
    createRentalMutation.mutate({
      bikeId: selectedBike!.id,
      stationId: selectedStation!.id,
      planId: selectedPlan!.id,
    });
  };

  // Book with schedule
  const handleScheduleConfirm = (date: Date, timeSlot: string) => {
    if (!selectedBike || !selectedStation || !selectedPlan) {
      toast({
        title: "Erro ao fazer agendamento",
        description: "Por favor, selecione uma bicicleta e um plano.",
        variant: "destructive",
      });
      return;
    }

    setScheduledTime(date);
    
    createRentalMutation.mutate({
      bikeId: selectedBike.id,
      stationId: selectedStation.id,
      planId: selectedPlan.id,
      scheduledTime: date.toISOString(),
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

  const goBackToBikeDetail = () => {
    setCurrentView('bikeDetail');
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
      
      {stationViewTab === 'map' && <Map onStationSelect={handleStationSelect} />}
      
      <BottomSheet expanded={sheetExpanded} onToggle={() => setSheetExpanded(!sheetExpanded)}>
        {currentView === 'stations' && (
          <div className="px-4 pb-8">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 text-primary dark:text-white">
                <span className="text-secondary">Bike</span>Share
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Encontre bicicletas disponíveis perto de você</p>
            </div>
            
            <Tabs value={stationViewTab} onValueChange={(v) => setStationViewTab(v as 'map' | 'list')} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="map" className="flex items-center">
                  <span className="material-icons text-sm mr-1">map</span>
                  Mapa
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center">
                  <span className="material-icons text-sm mr-1">view_list</span>
                  Lista
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
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
                <span className="material-icons animate-spin text-secondary">sync</span>
              </div>
            ) : filteredStations.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <span className="material-icons text-4xl mb-2">location_off</span>
                <p>Nenhuma estação encontrada</p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{filteredStations.length} estações encontradas</span>
                  <Badge variant="outline" className="flex items-center bg-secondary bg-opacity-10 text-secondary">
                    <span className="material-icons text-xs mr-1">sort</span>
                    Mais próximas
                  </Badge>
                </div>
                
                <div className={`${stationViewTab === 'list' ? 'block' : 'hidden'}`}>
                  {filteredStations.map(station => (
                    <StationCard 
                      key={station.id} 
                      station={station} 
                      onClick={handleStationSelect} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'stationDetail' && selectedStation && (
          <div className="px-4 pb-8">
            <div className="flex items-center mb-4">
              <button className="mr-2 text-zinc-800 dark:text-white" onClick={goBackToStations}>
                <span className="material-icons">arrow_back</span>
              </button>
              <h2 className="text-2xl font-semibold fade-in">{selectedStation.name}</h2>
            </div>
            
            <div className="relative mb-4 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={selectedStation.imageUrl} 
                alt={selectedStation.name} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">{selectedStation.address}</span>
                  <Badge 
                    variant="outline" 
                    className={`${selectedStation.availableBikes > 0 ? 'bg-secondary' : 'bg-destructive'} text-white`}
                  >
                    {selectedStation.availableBikes > 0 ? 'Disponível' : 'Indisponível'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mb-6 slide-in">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg">Detalhes da Estação</h3>
                <span className={`${selectedStation.availableBikes > 0 ? 'text-secondary' : 'text-destructive'} font-semibold`}>
                  {selectedStation.availableBikes} bicicletas disponíveis
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="material-icons text-secondary mr-2">location_on</span>
                  <span>{selectedStation.address}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="material-icons text-secondary mr-2">access_time</span>
                  <span>{selectedStation.openingTime} - {selectedStation.closingTime}</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-secondary mr-2">directions_walk</span>
                  <span>{selectedStation.distance} ({selectedStation.walkingTime})</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6 slide-in" style={{animationDelay: '0.1s'}}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg">Bicicletas Disponíveis</h3>
                <Badge variant="outline" className="flex items-center">
                  <span className="material-icons text-xs mr-1">sort</span>
                  Por condição
                </Badge>
              </div>
              
              {bikesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <span className="material-icons animate-spin text-3xl text-secondary mb-2">sync</span>
                    <span className="text-sm text-gray-500">Carregando bicicletas...</span>
                  </div>
                </div>
              ) : bikes.length === 0 ? (
                <div className="text-center py-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="material-icons text-4xl text-gray-400 mb-2">pedal_bike_off</span>
                  <p className="text-gray-500">Não há bicicletas disponíveis nesta estação.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bikes.map((bike, index) => (
                    <div 
                      key={bike.id}
                      className="slide-in"
                      style={{animationDelay: `${0.2 + index * 0.1}s`}}
                    >
                      <BikeCard 
                        bike={bike} 
                        onClick={handleBikeSelect} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {selectedStation.availableBikes > 0 && (
              <Button 
                className="w-full btn-primary"
                onClick={handleBookAnyBike}
              >
                <span className="material-icons mr-2">bolt</span>
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
              <h2 className="text-2xl font-semibold fade-in">{selectedBike.name}</h2>
            </div>
            
            <div className="relative rounded-xl overflow-hidden mb-4 shadow-lg">
              <img 
                src={selectedBike.imageUrl} 
                alt={selectedBike.name} 
                className="w-full h-52 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex items-center">
                  <div className="bg-white text-secondary rounded-full p-1 mr-2">
                    <span className="material-icons">pedal_bike</span>
                  </div>
                  <div>
                    <span className="text-white font-semibold">{selectedBike.type}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="material-icons text-sm text-yellow-400">
                          {i < (selectedBike.condition === 'Excelente' ? 5 : 4) ? 'star' : 'star_border'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6 slide-in">
              <h3 className="font-medium text-lg mb-2">Especificações</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 flex flex-col items-center">
                  <div className="bg-secondary bg-opacity-10 rounded-full p-2 mb-2">
                    <span className="material-icons text-secondary">cycling</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Tipo</span>
                  <span className="font-medium">{selectedBike.type}</span>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 flex flex-col items-center">
                  <div className="bg-secondary bg-opacity-10 rounded-full p-2 mb-2">
                    <span className="material-icons text-secondary">radio_button_checked</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Aro</span>
                  <span className="font-medium">{selectedBike.wheelSize}</span>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 flex flex-col items-center">
                  <div className="bg-secondary bg-opacity-10 rounded-full p-2 mb-2">
                    <span className="material-icons text-secondary">settings</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Marchas</span>
                  <span className="font-medium">{selectedBike.gears}</span>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 flex flex-col items-center">
                  <div className="bg-secondary bg-opacity-10 rounded-full p-2 mb-2">
                    <span className="material-icons text-secondary">battery_charging_full</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Bateria</span>
                  <span className="font-medium">{selectedBike.batteryLevel}%</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6 slide-in" style={{animationDelay: '0.2s'}}>
              <h3 className="font-medium text-lg mb-2">Planos de Aluguel</h3>
              <div className="space-y-3">
                {plans.map((plan, index) => (
                  <div key={plan.id} className="slide-in" style={{animationDelay: `${0.3 + index * 0.1}s`}}>
                    <RentalPlan 
                      plan={plan} 
                      selected={selectedPlan?.id === plan.id}
                      onClick={handlePlanSelect} 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 slide-in" style={{animationDelay: '0.5s'}}>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="btn-primary"
                  onClick={handleBookBike}
                  disabled={createRentalMutation.isPending}
                >
                  {createRentalMutation.isPending ? (
                    <span className="material-icons animate-spin mr-2">sync</span>
                  ) : (
                    <span className="material-icons mr-2">bolt</span>
                  )}
                  Alugar Agora
                </Button>
                
                <Button 
                  variant="outline"
                  className="border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors"
                  onClick={handleShowSchedule}
                >
                  <span className="material-icons mr-2">schedule</span>
                  Agendar
                </Button>
              </div>
              
              <Button 
                variant="link"
                className="w-full text-gray-500"
                onClick={goBackToStationDetail}
              >
                Voltar para Estação
              </Button>
            </div>
          </div>
        )}
        
        {currentView === 'scheduleBooking' && selectedStation && selectedBike && (
          <div className="px-4 pb-8">
            <div className="flex items-center mb-4">
              <button className="mr-2 text-zinc-800 dark:text-white" onClick={goBackToBikeDetail}>
                <span className="material-icons">arrow_back</span>
              </button>
              <h2 className="text-2xl font-semibold fade-in">Agendamento</h2>
            </div>
            
            <div className="mb-4 bg-secondary bg-opacity-10 rounded-xl p-4 flex items-center">
              <span className="material-icons text-secondary mr-3">info</span>
              <p className="text-sm">Agende o horário para retirar sua bicicleta. Você terá até 30 minutos de tolerância.</p>
            </div>
            
            <div className="slide-in">
              <ScheduleBooking 
                onScheduleConfirm={handleScheduleConfirm}
                stationOpeningTime={selectedStation.openingTime}
                stationClosingTime={selectedStation.closingTime}
              />
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-6 slide-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center mr-3">
                  <span className="material-icons text-secondary">pedal_bike</span>
                </div>
                <div>
                  <h4 className="font-medium">{selectedBike.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedStation.name}</p>
                </div>
              </div>
              
              {selectedPlan && (
                <div className="flex justify-between p-2 bg-white dark:bg-zinc-800 rounded-lg">
                  <span>Plano selecionado:</span>
                  <span className="font-medium text-secondary">{selectedPlan.name} - {selectedPlan.price}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'bookingConfirmation' && currentRental && (
          <div className="px-4 pb-8">
            <div className="text-center mb-6 slide-in">
              <div className="success-checkmark mb-4">
                <div className="check-icon"></div>
              </div>
              <h2 className="text-2xl font-semibold mb-1">Reserva Confirmada!</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {scheduledTime 
                  ? `Sua bicicleta estará disponível no horário agendado` 
                  : `Sua bicicleta está aguardando por você`}
              </p>
              {scheduledTime && (
                <div className="mt-2 inline-block bg-secondary bg-opacity-10 text-secondary px-3 py-1 rounded-full">
                  <span className="material-icons text-sm mr-1 align-text-bottom">event</span>
                  {format(scheduledTime, "dd/MM/yyyy 'às' HH:mm")}
                </div>
              )}
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-6 slide-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mr-4">
                  <span className="material-icons text-secondary">pedal_bike</span>
                </div>
                <div>
                  <h3 className="font-medium">{currentRental.bikeName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentRental.stationName}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between p-2 bg-white dark:bg-zinc-800 rounded-lg">
                  <span className="flex items-center">
                    <span className="material-icons text-secondary text-sm mr-1">schedule</span>
                    Plano:
                  </span>
                  <span className="font-semibold">{currentRental.planName}</span>
                </div>
                <div className="flex justify-between p-2 bg-white dark:bg-zinc-800 rounded-lg">
                  <span className="flex items-center">
                    <span className="material-icons text-secondary text-sm mr-1">play_circle</span>
                    Início:
                  </span>
                  <span>{currentRental.startTime}</span>
                </div>
                <div className="flex justify-between p-2 bg-white dark:bg-zinc-800 rounded-lg">
                  <span className="flex items-center">
                    <span className="material-icons text-secondary text-sm mr-1">stop_circle</span>
                    Término:
                  </span>
                  <span>{currentRental.endTime}</span>
                </div>
                <div className="flex justify-between p-2 bg-white dark:bg-zinc-800 rounded-lg">
                  <span className="flex items-center">
                    <span className="material-icons text-secondary text-sm mr-1">payments</span>
                    Valor:
                  </span>
                  <span className="font-semibold">{currentRental.price}</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 flex items-center border-l-4 border-secondary">
                <div className="bg-secondary text-white rounded-lg py-2 px-3 mr-3">
                  <span className="material-icons">qr_code_2</span>
                </div>
                <div>
                  <p className="font-medium">Código de Desbloqueio</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Escaneie no totem da estação</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 slide-in" style={{animationDelay: '0.4s'}}>
              <Button 
                className="w-full btn-primary"
                onClick={navigateToStation}
              >
                <span className="material-icons mr-2">navigation</span>
                Navegar até a Estação
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border border-gray-300 dark:border-gray-600 text-zinc-800 dark:text-white"
                onClick={() => setCurrentView('stations')}
              >
                <span className="material-icons mr-2">home</span>
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
