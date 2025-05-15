import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Award, 
  BarChart2, 
  Calendar, 
  Clock, 
  Flame, 
  MapPin, 
  ArrowUp, 
  CircleDollarSign,
  TrendingUp,
  Bike,
  ThermometerSun
} from 'lucide-react';
import Header from '../components/Header';

// Formatter para exibir duração em horas e minutos
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

// Formatter para exibir distância em km com 1 casa decimal
const formatDistance = (km: number) => {
  return `${km.toFixed(1)} km`;
};

// Formatter para exibir velocidade em km/h
const formatSpeed = (kmh: number) => {
  return `${kmh.toFixed(1)} km/h`;
};

export default function Performance() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [tabValue, setTabValue] = useState('summary');

  // Dados simulados - serão substituídos por chamadas reais à API
  const weeklyStats = {
    totalDistance: 32.5,
    totalDuration: 6480, // em segundos (1h48min)
    totalCalories: 850,
    ridesCount: 4,
    avgSpeed: 18.2,
    elevationGain: 120,
    weeklyGoal: 50 // km
  };
  
  const monthlyStats = {
    totalDistance: 128.7,
    totalDuration: 24300, // em segundos (6h45min)
    totalCalories: 3250,
    ridesCount: 16,
    avgSpeed: 19.5,
    elevationGain: 520,
    monthlyGoal: 200 // km
  };
  
  const achievements = [
    { id: 1, name: 'Primeiro Passeio', description: 'Realizou sua primeira viagem', icon: <Bike className="h-6 w-6 text-green-500" />, date: '12/05/2025' },
    { id: 2, name: 'Maratonista', description: 'Percorreu 100km no total', icon: <Award className="h-6 w-6 text-yellow-500" />, date: '14/05/2025' },
    { id: 3, name: 'Eco-Friendly', description: 'Economizou 5kg de CO2', icon: <ThermometerSun className="h-6 w-6 text-blue-500" />, date: '15/05/2025' },
  ];
  
  const recentRides = [
    { 
      id: 1, 
      date: '15/05/2025', 
      start: 'Estação Paulista', 
      end: 'Parque Ibirapuera', 
      distance: 5.2, 
      duration: 1260, // 21min
      calories: 180
    },
    { 
      id: 2, 
      date: '14/05/2025', 
      start: 'Parque Ibirapuera', 
      end: 'Estação Paulista', 
      distance: 5.4, 
      duration: 1320, // 22min
      calories: 190
    },
    { 
      id: 3, 
      date: '12/05/2025', 
      start: 'Estação Paulista', 
      end: 'Parque Villa Lobos', 
      distance: 9.8, 
      duration: 2400, // 40min
      calories: 320
    },
  ];

  // Calcular percentual da meta semanal
  const weeklyGoalPercentage = Math.min(Math.round((weeklyStats.totalDistance / weeklyStats.weeklyGoal) * 100), 100);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onProfileClick={() => setProfileOpen(true)} />
      
      <main className="flex-1 p-4 max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seu Desempenho</h1>
          <p className="text-gray-600">Acompanhe suas estatísticas de ciclismo e conquistas</p>
        </div>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="summary">Resumo</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>
          
          {/* Tab de Resumo */}
          <TabsContent value="summary" className="space-y-4">
            {/* Cards Principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">Distância Total Semanal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-1">
                    <div className="text-3xl font-bold text-gray-900">{formatDistance(weeklyStats.totalDistance)}</div>
                    <div className="text-xs text-gray-500">Meta: {formatDistance(weeklyStats.weeklyGoal)}</div>
                    <Progress value={weeklyGoalPercentage} className="h-2 mt-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">Tempo Total Semanal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-1">
                    <div className="text-3xl font-bold text-gray-900">{formatDuration(weeklyStats.totalDuration)}</div>
                    <div className="text-xs text-gray-500">{weeklyStats.ridesCount} passeios esta semana</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal">Calorias Queimadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-1">
                    <div className="text-3xl font-bold text-gray-900">{weeklyStats.totalCalories} kcal</div>
                    <div className="text-xs text-gray-500">Média de {Math.round(weeklyStats.totalCalories / weeklyStats.ridesCount)} kcal por passeio</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Estatísticas Detalhadas */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Detalhadas</CardTitle>
                <CardDescription>Resumo de suas atividades de ciclismo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="w-5 h-5 text-green-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Média Velocidade</span>
                      <span className="font-medium">{formatSpeed(weeklyStats.avgSpeed)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Tempo no Mês</span>
                      <span className="font-medium">{formatDuration(monthlyStats.totalDuration)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Passeios no Mês</span>
                      <span className="font-medium">{monthlyStats.ridesCount} passeios</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Distância no Mês</span>
                      <span className="font-medium">{formatDistance(monthlyStats.totalDistance)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Calorias no Mês</span>
                      <span className="font-medium">{monthlyStats.totalCalories} kcal</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ArrowUp className="w-5 h-5 text-indigo-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Ganho de Elevação</span>
                      <span className="font-medium">{weeklyStats.elevationGain}m</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Últimas Conquistas */}
            <Card>
              <CardHeader>
                <CardTitle>Últimas Conquistas</CardTitle>
                <CardDescription>Continue pedalando para desbloquear mais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                      <div className="bg-gray-100 p-2 rounded-full">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-gray-500">{achievement.description}</div>
                      </div>
                      <div className="text-xs text-gray-400">{achievement.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ver Todas as Conquistas</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Tab de Histórico */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Passeios</CardTitle>
                <CardDescription>Seus passeios mais recentes</CardDescription>
              </CardHeader>
              <CardContent>
                {recentRides.map((ride) => (
                  <div key={ride.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{ride.start} → {ride.end}</div>
                      <div className="text-sm text-gray-500">{ride.date}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{formatDistance(ride.distance)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatDuration(ride.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4 text-gray-400" />
                        <span>{ride.calories} kcal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ver Todos os Passeios</Button>
              </CardFooter>
            </Card>
            
            {/* Estatísticas Mensais */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Mensais</CardTitle>
                <CardDescription>Seu progresso ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md mb-4">
                  <div className="text-gray-400 text-center">
                    <BarChart2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Gráfico de progresso mensal</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">Maio 2025</div>
                    <div className="text-2xl font-bold">{formatDistance(monthlyStats.totalDistance)}</div>
                    <div className="text-xs text-green-500 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" /> 12% em relação ao mês anterior
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">Abril 2025</div>
                    <div className="text-2xl font-bold">{formatDistance(monthlyStats.totalDistance * 0.88)}</div>
                    <div className="text-xs text-gray-500">16 passeios</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab de Conquistas */}
          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Suas Conquistas</CardTitle>
                <CardDescription>Badges desbloqueados por seu progresso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-4 border border-gray-100 rounded-lg p-4">
                      <div className="bg-gray-100 p-3 rounded-full">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-gray-500">{achievement.description}</div>
                        <div className="text-xs text-gray-400 mt-1">Conquistado em {achievement.date}</div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-4 border border-dashed border-gray-200 rounded-lg p-4">
                    <div className="bg-gray-50 p-3 rounded-full">
                      <Award className="h-6 w-6 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-500">Explorador Urbano</div>
                      <div className="text-sm text-gray-400">Visite 5 estações diferentes</div>
                      <div className="text-xs text-gray-400 mt-1">2 de 5 estações visitadas</div>
                      <Progress value={40} className="h-1 mt-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 border border-dashed border-gray-200 rounded-lg p-4">
                    <div className="bg-gray-50 p-3 rounded-full">
                      <CircleDollarSign className="h-6 w-6 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-500">Economizador</div>
                      <div className="text-sm text-gray-400">Economize R$50 em transporte</div>
                      <div className="text-xs text-gray-400 mt-1">R$32 economizados</div>
                      <Progress value={64} className="h-1 mt-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Próximos Desafios</CardTitle>
                <CardDescription>Continue pedalando para atingir estas metas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">200km no mês</div>
                      <div className="text-sm text-green-500">{Math.round((monthlyStats.totalDistance / 200) * 100)}%</div>
                    </div>
                    <Progress value={(monthlyStats.totalDistance / 200) * 100} className="h-2 mb-2" />
                    <div className="text-sm text-gray-500">Pedale 200km em um único mês</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">30 dias consecutivos</div>
                      <div className="text-sm text-green-500">23%</div>
                    </div>
                    <Progress value={23} className="h-2 mb-2" />
                    <div className="text-sm text-gray-500">Faça pelo menos um passeio por dia durante 30 dias</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">Madrugador</div>
                      <div className="text-sm text-green-500">50%</div>
                    </div>
                    <Progress value={50} className="h-2 mb-2" />
                    <div className="text-sm text-gray-500">Faça 5 passeios antes das 7h da manhã</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ver Todos os Desafios</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}