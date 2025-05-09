import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Rental } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("history");

  const { 
    data: rentals = [], 
    isLoading 
  } = useQuery<Rental[]>({
    queryKey: ['/api/rentals'],
  });

  // Group rentals by status
  const activeRentals = rentals.filter(rental => rental.status === 'active');
  const pastRentals = rentals.filter(rental => rental.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pt-16 pb-8 px-4">
      <div className="max-w-screen-md mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <span className="material-icons">arrow_back</span>
          </Button>
          <h1 className="text-2xl font-bold">Minha Conta</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                <span className="material-icons text-3xl text-gray-500 dark:text-gray-400">person</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">João Silva</h2>
                <p className="text-gray-600 dark:text-gray-400">joao.silva@email.com</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Membro desde Out 2023</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="history">Histórico de Aluguéis</TabsTrigger>
            <TabsTrigger value="payment">Métodos de Pagamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <span className="material-icons animate-spin text-3xl">sync</span>
              </div>
            ) : (
              <>
                {activeRentals.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Aluguéis Ativos</h3>
                    {activeRentals.map(rental => (
                      <Card key={rental.id} className="mb-3">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <span className="material-icons text-accent mr-3 mt-1">pedal_bike</span>
                              <div>
                                <h4 className="font-medium">{rental.bikeName}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{rental.stationName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Início: {rental.startTime} • Término: {rental.endTime}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 bg-secondary bg-opacity-10 text-secondary text-xs rounded-full">
                                Ativo
                              </span>
                              <p className="font-semibold mt-1">{rental.price}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-3">Histórico de Aluguéis</h3>
                  {pastRentals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Você ainda não possui histórico de aluguéis
                    </div>
                  ) : (
                    pastRentals.map(rental => (
                      <Card key={rental.id} className="mb-3">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <span className="material-icons text-gray-400 mr-3 mt-1">pedal_bike</span>
                              <div>
                                <h4 className="font-medium">{rental.bikeName}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{rental.stationName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {rental.startTime} - {rental.endTime}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                Concluído
                              </span>
                              <p className="font-semibold mt-1">{rental.price}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="payment">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Métodos de Pagamento</h3>
                  <Button variant="outline" size="sm">
                    <span className="material-icons text-sm mr-1">add</span>
                    Adicionar
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <span className="material-icons text-accent mr-3">credit_card</span>
                      <div>
                        <p className="font-medium">Mastercard •••• 4589</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Expira em 11/2025</p>
                      </div>
                    </div>
                    <span className="inline-block px-2 py-1 bg-secondary bg-opacity-10 text-secondary text-xs rounded-full">
                      Principal
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <span className="material-icons text-accent mr-3">credit_card</span>
                      <div>
                        <p className="font-medium">Visa •••• 7832</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Expira em 03/2024</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <span className="material-icons text-sm">more_vert</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
