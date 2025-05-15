import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRentalSchema } from "@shared/schema";
import { z } from "zod";
import { format, add } from "date-fns";
import { setupWebSocketServer } from './websocket';
import { addNewStations } from './addStations';

export async function registerRoutes(app: Express): Promise<Server> {
  // Add new stations endpoint (temporário, para adicionar as novas estações)
  app.get('/api/stations/add-new', async (req, res) => {
    try {
      const result = await addNewStations();
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add new stations', error });
    }
  });

  // Get all stations
  app.get('/api/stations', async (req, res) => {
    try {
      // Tentativa de adicionar novas estações se ainda não existirem
      await addNewStations().catch(err => console.error("Erro ao adicionar estações:", err));
      
      const stations = await storage.getStations();
      res.json(stations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch stations' });
    }
  });

  // Get single station
  app.get('/api/stations/:id', async (req, res) => {
    try {
      const stationId = parseInt(req.params.id);
      const station = await storage.getStation(stationId);
      
      if (!station) {
        return res.status(404).json({ message: 'Station not found' });
      }
      
      res.json(station);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch station' });
    }
  });

  // Get bikes for a station
  app.get('/api/stations/:id/bikes', async (req, res) => {
    try {
      const stationId = parseInt(req.params.id);
      const bikes = await storage.getBikesByStation(stationId);
      res.json(bikes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bikes' });
    }
  });

  // Get all bikes
  app.get('/api/bikes', async (req, res) => {
    try {
      const bikes = await storage.getBikes();
      res.json(bikes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bikes' });
    }
  });

  // Get single bike
  app.get('/api/bikes/:id', async (req, res) => {
    try {
      const bikeId = parseInt(req.params.id);
      const bike = await storage.getBike(bikeId);
      
      if (!bike) {
        return res.status(404).json({ message: 'Bike not found' });
      }
      
      res.json(bike);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bike' });
    }
  });

  // Create rental
  app.post('/api/rentals', async (req, res) => {
    try {
      const rentalData = insertRentalSchema.parse(req.body);
      
      // Calculate end time based on plan
      let endTime = new Date();
      
      switch (rentalData.planId) {
        case 1: // Hourly
          endTime = add(new Date(), { hours: 1 });
          break;
        case 2: // Daily
          endTime = add(new Date(), { days: 1 });
          break;
        case 3: // Weekly
          endTime = add(new Date(), { weeks: 1 });
          break;
        default:
          endTime = add(new Date(), { hours: 1 });
      }
      
      // Create rental
      const rental = await storage.createRental({
        ...rentalData,
        endTime: endTime,
      });
      
      // Decrease available bikes at the station
      await storage.decreaseStationBikes(rentalData.stationId);
      
      res.status(201).json(rental);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid rental data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create rental' });
    }
  });

  // Get all rentals for a user
  app.get('/api/rentals', async (req, res) => {
    try {
      // Since this is a demo, we'll return all rentals
      const rentals = await storage.getRentals();
      res.json(rentals);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch rentals' });
    }
  });

  // Get single rental
  app.get('/api/rentals/:id', async (req, res) => {
    try {
      const rentalId = parseInt(req.params.id);
      const rental = await storage.getRental(rentalId);
      
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      
      res.json(rental);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch rental' });
    }
  });
  
  // Performance dashboard endpoints
  
  // Get user weekly stats
  app.get('/api/performance/weekly', async (req, res) => {
    try {
      const userId = 1; // Simulação de usuário logado
      
      // Dados simulados para o front-end
      // Em produção, isso viria dos métodos implementados no storage:
      // const stats = await storage.getUserWeeklyStats(userId);
      
      const stats = {
        totalDistance: 32.5,
        totalDuration: 6480, // em segundos (1h48min)
        totalCalories: 850,
        ridesCount: 4,
        avgSpeed: 18.2,
        elevationGain: 120,
        weeklyGoal: 50 // km
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Erro ao obter estatísticas semanais:', error);
      res.status(500).json({ message: 'Erro ao obter estatísticas semanais' });
    }
  });
  
  // Get user monthly stats
  app.get('/api/performance/monthly', async (req, res) => {
    try {
      const userId = 1; // Simulação de usuário logado
      
      // Dados simulados para o front-end
      // Em produção, isso viria dos métodos implementados no storage:
      // const stats = await storage.getUserMonthlyStats(userId);
      
      const stats = {
        totalDistance: 128.7,
        totalDuration: 24300, // em segundos (6h45min)
        totalCalories: 3250,
        ridesCount: 16,
        avgSpeed: 19.5,
        elevationGain: 520,
        monthlyGoal: 200 // km
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Erro ao obter estatísticas mensais:', error);
      res.status(500).json({ message: 'Erro ao obter estatísticas mensais' });
    }
  });
  
  // Get user achievements
  app.get('/api/performance/achievements', async (req, res) => {
    try {
      const userId = 1; // Simulação de usuário logado
      
      // Dados simulados para o front-end
      // Em produção, isso viria dos métodos implementados no storage:
      // const achievements = await storage.getUserAchievements(userId);
      
      const achievements = [
        { id: 1, name: 'Primeiro Passeio', description: 'Realizou sua primeira viagem', iconName: 'directions_bike', iconColor: 'green', date: '12/05/2025' },
        { id: 2, name: 'Maratonista', description: 'Percorreu 100km no total', iconName: 'emoji_events', iconColor: 'yellow', date: '14/05/2025' },
        { id: 3, name: 'Eco-Friendly', description: 'Economizou 5kg de CO2', iconName: 'eco', iconColor: 'blue', date: '15/05/2025' },
      ];
      
      res.json(achievements);
    } catch (error) {
      console.error('Erro ao obter conquistas:', error);
      res.status(500).json({ message: 'Erro ao obter conquistas' });
    }
  });
  
  // Get user rides history
  app.get('/api/performance/rides', async (req, res) => {
    try {
      const userId = 1; // Simulação de usuário logado
      
      // Dados simulados para o front-end
      // Em produção, isso viria dos métodos implementados no storage:
      // const rides = await storage.getRideStats(userId);
      
      const rides = [
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
      
      res.json(rides);
    } catch (error) {
      console.error('Erro ao obter histórico de passeios:', error);
      res.status(500).json({ message: 'Erro ao obter histórico de passeios' });
    }
  });
  
  // Update user performance goals
  app.post('/api/performance/goals', async (req, res) => {
    try {
      const userId = 1; // Simulação de usuário logado
      const { weeklyDistanceGoal, weeklyDurationGoal, weeklyCaloriesGoal } = req.body;
      
      // Em produção, isso utilizaria os métodos implementados no storage:
      /*
      let goals = await storage.getUserPerformanceGoals(userId);
      
      if (goals) {
        goals = await storage.updateUserPerformanceGoals(goals.id, {
          weeklyDistanceGoal,
          weeklyDurationGoal,
          weeklyCaloriesGoal
        });
      } else {
        goals = await storage.createUserPerformanceGoals({
          userId,
          weeklyDistanceGoal,
          weeklyDurationGoal,
          weeklyCaloriesGoal
        });
      }
      */
      
      // Dados simulados para resposta
      const goals = {
        id: 1,
        userId,
        weeklyDistanceGoal: weeklyDistanceGoal || 50,
        weeklyDurationGoal: weeklyDurationGoal || 300, // 5 horas
        weeklyCaloriesGoal: weeklyCaloriesGoal || 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      res.json(goals);
    } catch (error) {
      console.error('Erro ao atualizar metas de desempenho:', error);
      res.status(500).json({ message: 'Erro ao atualizar metas de desempenho' });
    }
  });

  const httpServer = createServer(app);
  
  // Inicializa o servidor WebSocket para rastreamento em tempo real
  setupWebSocketServer(httpServer);
  
  return httpServer;
}
