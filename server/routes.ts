import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRentalSchema } from "@shared/schema";
import { z } from "zod";
import { format, add } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all stations
  app.get('/api/stations', async (req, res) => {
    try {
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
        endTime: endTime.toISOString(),
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

  const httpServer = createServer(app);
  return httpServer;
}
