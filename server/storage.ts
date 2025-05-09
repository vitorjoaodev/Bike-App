import { 
  type User, type InsertUser, 
  type Station, type InsertStation,
  type Bike, type InsertBike,
  type Rental, type InsertRental,
  users, stations, bikes, rentals 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { format, addDays } from "date-fns";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Station operations
  getStations(): Promise<Station[]>;
  getStation(id: number): Promise<Station | undefined>;
  createStation(station: InsertStation): Promise<Station>;
  decreaseStationBikes(id: number): Promise<Station>;
  
  // Bike operations
  getBikes(): Promise<Bike[]>;
  getBike(id: number): Promise<Bike | undefined>;
  getBikesByStation(stationId: number): Promise<Bike[]>;
  createBike(bike: InsertBike): Promise<Bike>;
  
  // Rental operations
  getRentals(): Promise<Rental[]>;
  getRental(id: number): Promise<Rental | undefined>;
  getRentalsByUser(userId: number): Promise<Rental[]>;
  createRental(rental: InsertRental): Promise<Rental>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  // Station operations
  async getStations(): Promise<Station[]> {
    return await db.select().from(stations);
  }

  async getStation(id: number): Promise<Station | undefined> {
    const result = await db.select().from(stations).where(eq(stations.id, id));
    return result[0];
  }

  async createStation(stationData: InsertStation): Promise<Station> {
    const result = await db.insert(stations).values(stationData).returning();
    return result[0];
  }

  async decreaseStationBikes(id: number): Promise<Station> {
    const station = await this.getStation(id);
    
    if (!station) {
      throw new Error(`Station with id ${id} not found`);
    }
    
    if (station.availableBikes <= 0) {
      throw new Error(`No bikes available at station ${id}`);
    }
    
    const result = await db
      .update(stations)
      .set({ availableBikes: station.availableBikes - 1 })
      .where(eq(stations.id, id))
      .returning();
    
    return result[0];
  }

  // Bike operations
  async getBikes(): Promise<Bike[]> {
    return await db.select().from(bikes);
  }

  async getBike(id: number): Promise<Bike | undefined> {
    const result = await db.select().from(bikes).where(eq(bikes.id, id));
    return result[0];
  }

  async getBikesByStation(stationId: number): Promise<Bike[]> {
    return await db.select().from(bikes).where(eq(bikes.stationId, stationId));
  }

  async createBike(bikeData: InsertBike): Promise<Bike> {
    const result = await db.insert(bikes).values(bikeData).returning();
    return result[0];
  }

  // Rental operations
  async getRentals(): Promise<Rental[]> {
    return await db.select().from(rentals);
  }

  async getRental(id: number): Promise<Rental | undefined> {
    const result = await db.select().from(rentals).where(eq(rentals.id, id));
    return result[0];
  }

  async getRentalsByUser(userId: number): Promise<Rental[]> {
    return await db.select().from(rentals).where(eq(rentals.userId, userId));
  }

  async createRental(rentalData: InsertRental): Promise<Rental> {
    // Get the bike and station for additional details
    const bike = await this.getBike(rentalData.bikeId);
    if (!bike) {
      throw new Error(`Bike with id ${rentalData.bikeId} not found`);
    }
    
    const station = await this.getStation(rentalData.stationId);
    if (!station) {
      throw new Error(`Station with id ${rentalData.stationId} not found`);
    }
    
    // Check if bike is available at this station
    if (bike.stationId !== rentalData.stationId) {
      throw new Error(`Bike ${rentalData.bikeId} is not available at station ${rentalData.stationId}`);
    }
    
    // Check if station has available bikes
    if (station.availableBikes <= 0) {
      throw new Error(`No bikes available at station ${rentalData.stationId}`);
    }
    
    // Determine price based on plan
    let price = "R$ 8,00";
    let planName = "Por Hora";
    
    switch (rentalData.planId) {
      case 1: // Hourly
        price = "R$ 8,00";
        planName = "Por Hora (1 hora)";
        break;
      case 2: // Daily
        price = "R$ 30,00";
        planName = "Diária (24 horas)";
        break;
      case 3: // Weekly
        price = "R$ 120,00";
        planName = "Semanal (7 dias)";
        break;
    }
    
    // Create the rental record
    const result = await db.insert(rentals).values({
      ...rentalData,
      status: "active",
      price,
      startTime: new Date(),
    }).returning();
    
    const rental = result[0];
    
    // Decrease available bikes at the station
    await this.decreaseStationBikes(rentalData.stationId);
    
    // Enhanced rental for display
    const displayRental = {
      ...rental,
      bikeName: bike.name,
      stationName: station.name,
      planName,
      // Keep the original Date objects but add formatted versions for display
      startTimeFormatted: format(new Date(rental.startTime), "dd/MM/yyyy, HH:mm"),
      endTimeFormatted: format(new Date(rental.endTime), "dd/MM/yyyy, HH:mm"),
    };
    
    return displayRental as unknown as Rental;
  }
}

// Initialize the database storage
export const storage = new DatabaseStorage();
