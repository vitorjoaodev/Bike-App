import { 
  type User, type InsertUser, 
  type Station, type InsertStation,
  type Bike, type InsertBike,
  type Rental, type InsertRental,
  type RideStats, type InsertRideStats,
  type UserPerformanceGoals, type InsertUserPerformanceGoals,
  type AchievementType, type UserAchievement, type InsertUserAchievement,
  users, stations, bikes, rentals, rideStats, userPerformanceGoals,
  achievementTypes, userAchievements
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
  
  // Ride stats operations
  getRideStats(userId: number): Promise<RideStats[]>;
  getRideStatsByDate(userId: number, startDate: Date, endDate?: Date): Promise<RideStats[]>;
  getRideStat(id: number): Promise<RideStats | undefined>;
  createRideStat(rideStat: InsertRideStats): Promise<RideStats>;
  
  // User performance goals operations
  getUserPerformanceGoals(userId: number): Promise<UserPerformanceGoals | undefined>;
  createUserPerformanceGoals(goals: InsertUserPerformanceGoals): Promise<UserPerformanceGoals>;
  updateUserPerformanceGoals(id: number, goals: Partial<InsertUserPerformanceGoals>): Promise<UserPerformanceGoals>;
  
  // Achievement operations
  getAchievementTypes(): Promise<AchievementType[]>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievementType: AchievementType })[]>;
  createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // Performance analytics
  getUserWeeklyStats(userId: number): Promise<{
    totalDistance: number;
    totalDuration: number;
    totalCalories: number;
    ridesCount: number;
    avgSpeed: number;
  }>;
  getUserMonthlyStats(userId: number): Promise<{
    totalDistance: number;
    totalDuration: number;
    totalCalories: number;
    ridesCount: number;
    avgSpeed: number;
  }>;
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
    
    const [updatedStation] = await db
      .update(stations)
      .set({ availableBikes: station.availableBikes - 1 })
      .where(eq(stations.id, id))
      .returning();
      
    return updatedStation;
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
    // Get bike and station info for rental pricing
    const bike = await this.getBike(rentalData.bikeId);
    if (!bike) {
      throw new Error(`Bike with id ${rentalData.bikeId} not found`);
    }
    
    const station = await this.getStation(rentalData.stationId);
    if (!station) {
      throw new Error(`Station with id ${rentalData.stationId} not found`);
    }
    
    // Basic pricing logic based on rental plan
    let price = 0;
    let planName = "";
    
    switch (rentalData.plan) {
      case "hourly":
        price = 10;
        planName = "Hourly (R$10/hour)";
        break;
      case "daily":
        price = 30;
        planName = "Daily (R$30/day)";
        break;
      case "weekly":
        price = 100;
        planName = "Weekly (R$100/week)";
        break;
      default:
        price = 10; // Default to hourly
        planName = "Hourly (R$10/hour)";
    }
    
    // Create the rental record
    const result = await db.insert(rentals).values({
      ...rentalData,
      status: "active",
      price: price.toString(),
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
      startTimeFormatted: format(rental.startTime!, "MMM d, yyyy 'at' h:mm a"),
      endTimeFormatted: rental.endTime ? format(rental.endTime, "MMM d, yyyy 'at' h:mm a") : null,
      returnByFormatted: format(addDays(rental.startTime!, 1), "MMM d, yyyy 'at' h:mm a"),
    };
    
    return displayRental as unknown as Rental;
  }
  
  // Ride stats operations
  async getRideStats(userId: number): Promise<RideStats[]> {
    return await db.select().from(rideStats).where(eq(rideStats.userId, userId)).orderBy(rideStats.date);
  }
  
  async getRideStatsByDate(userId: number, startDate: Date, endDate?: Date): Promise<RideStats[]> {
    let query = db
      .select()
      .from(rideStats)
      .where(eq(rideStats.userId, userId));
      
    if (endDate) {
      query = query.where(and(
        rideStats.date >= startDate.toISOString().split('T')[0],
        rideStats.date <= endDate.toISOString().split('T')[0]
      ));
    } else {
      query = query.where(rideStats.date >= startDate.toISOString().split('T')[0]);
    }
      
    return await query.orderBy(rideStats.date);
  }
  
  async getRideStat(id: number): Promise<RideStats | undefined> {
    const result = await db.select().from(rideStats).where(eq(rideStats.id, id));
    return result[0];
  }
  
  async createRideStat(rideStatData: InsertRideStats): Promise<RideStats> {
    const result = await db.insert(rideStats).values(rideStatData).returning();
    return result[0];
  }
  
  // User performance goals operations
  async getUserPerformanceGoals(userId: number): Promise<UserPerformanceGoals | undefined> {
    const result = await db.select().from(userPerformanceGoals).where(eq(userPerformanceGoals.userId, userId));
    return result[0];
  }
  
  async createUserPerformanceGoals(goalsData: InsertUserPerformanceGoals): Promise<UserPerformanceGoals> {
    const result = await db.insert(userPerformanceGoals).values({
      ...goalsData,
      updatedAt: new Date()
    }).returning();
    return result[0];
  }
  
  async updateUserPerformanceGoals(id: number, goalsData: Partial<InsertUserPerformanceGoals>): Promise<UserPerformanceGoals> {
    const result = await db
      .update(userPerformanceGoals)
      .set({
        ...goalsData,
        updatedAt: new Date()
      })
      .where(eq(userPerformanceGoals.id, id))
      .returning();
    return result[0];
  }
  
  // Achievement operations
  async getAchievementTypes(): Promise<AchievementType[]> {
    return await db.select().from(achievementTypes);
  }
  
  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievementType: AchievementType })[]> {
    const userAchievementsWithTypes = await db
      .select({
        id: userAchievements.id,
        userId: userAchievements.userId,
        achievementTypeId: userAchievements.achievementTypeId,
        earnedAt: userAchievements.earnedAt,
        achievementType: achievementTypes
      })
      .from(userAchievements)
      .innerJoin(achievementTypes, eq(userAchievements.achievementTypeId, achievementTypes.id))
      .where(eq(userAchievements.userId, userId));
    
    return userAchievementsWithTypes;
  }
  
  async createUserAchievement(achievementData: InsertUserAchievement): Promise<UserAchievement> {
    const result = await db.insert(userAchievements).values(achievementData).returning();
    return result[0];
  }
  
  // Performance analytics
  async getUserWeeklyStats(userId: number): Promise<{
    totalDistance: number;
    totalDuration: number;
    totalCalories: number;
    ridesCount: number;
    avgSpeed: number;
  }> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const stats = await this.getRideStatsByDate(userId, startOfWeek);
    
    if (stats.length === 0) {
      return {
        totalDistance: 0,
        totalDuration: 0,
        totalCalories: 0,
        ridesCount: 0,
        avgSpeed: 0
      };
    }
    
    const totalDistance = stats.reduce((sum, stat) => sum + stat.distance, 0);
    const totalDuration = stats.reduce((sum, stat) => sum + stat.duration, 0);
    const totalCalories = stats.reduce((sum, stat) => sum + stat.caloriesBurned, 0);
    
    return {
      totalDistance,
      totalDuration,
      totalCalories,
      ridesCount: stats.length,
      avgSpeed: totalDuration > 0 ? totalDistance / (totalDuration / 3600) : 0 // km/h
    };
  }
  
  async getUserMonthlyStats(userId: number): Promise<{
    totalDistance: number;
    totalDuration: number;
    totalCalories: number;
    ridesCount: number;
    avgSpeed: number;
  }> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const stats = await this.getRideStatsByDate(userId, startOfMonth);
    
    if (stats.length === 0) {
      return {
        totalDistance: 0,
        totalDuration: 0,
        totalCalories: 0,
        ridesCount: 0,
        avgSpeed: 0
      };
    }
    
    const totalDistance = stats.reduce((sum, stat) => sum + stat.distance, 0);
    const totalDuration = stats.reduce((sum, stat) => sum + stat.duration, 0);
    const totalCalories = stats.reduce((sum, stat) => sum + stat.caloriesBurned, 0);
    
    return {
      totalDistance,
      totalDuration,
      totalCalories,
      ridesCount: stats.length,
      avgSpeed: totalDuration > 0 ? totalDistance / (totalDuration / 3600) : 0 // km/h
    };
  }
}

export const storage = new DatabaseStorage();