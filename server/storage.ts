import { 
  type User, type InsertUser, 
  type Station, type InsertStation,
  type Bike, type InsertBike,
  type Rental, type InsertRental 
} from "@shared/schema";
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

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stations: Map<number, Station>;
  private bikes: Map<number, Bike>;
  private rentals: Map<number, Rental>;
  
  private userIdCounter: number;
  private stationIdCounter: number;
  private bikeIdCounter: number;
  private rentalIdCounter: number;

  constructor() {
    this.users = new Map();
    this.stations = new Map();
    this.bikes = new Map();
    this.rentals = new Map();
    
    this.userIdCounter = 1;
    this.stationIdCounter = 1;
    this.bikeIdCounter = 1;
    this.rentalIdCounter = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Create sample user
    const sampleUser: User = {
      id: this.userIdCounter++,
      username: "joaosilva",
      password: "password123",
      fullName: "João Silva",
      email: "joao.silva@email.com",
      memberSince: new Date().toISOString()
    };
    this.users.set(sampleUser.id, sampleUser);
    
    // Create sample stations
    const stations: Station[] = [
      {
        id: this.stationIdCounter++,
        name: "Estação Paulista",
        address: "Av. Paulista, 1578",
        lat: "-23.562305",
        lng: "-46.654891",
        availableBikes: 8,
        totalDocks: 12,
        openingTime: "6:00",
        closingTime: "22:00",
        distance: "400m",
        walkingTime: "5 min caminhando",
        imageUrl: "https://pixabay.com/get/g2995bae173ba5bec8b41ce922ebb72a59e0526ebb5bf1e7fd9d6b76611a8969ecd846d0f197fc6d05370783477075e1e5bbb392a38e21577bb96169a580030b3_1280.jpg"
      },
      {
        id: this.stationIdCounter++,
        name: "Estação Ibirapuera",
        address: "Parque Ibirapuera, Portão 3",
        lat: "-23.587677",
        lng: "-46.657275",
        availableBikes: 12,
        totalDocks: 20,
        openingTime: "6:00",
        closingTime: "20:00",
        distance: "1.2km",
        walkingTime: "15 min caminhando",
        imageUrl: "https://pixabay.com/get/g2995bae173ba5bec8b41ce922ebb72a59e0526ebb5bf1e7fd9d6b76611a8969ecd846d0f197fc6d05370783477075e1e5bbb392a38e21577bb96169a580030b3_1280.jpg"
      },
      {
        id: this.stationIdCounter++,
        name: "Estação Pinheiros",
        address: "Rua dos Pinheiros, 854",
        lat: "-23.566030",
        lng: "-46.681942",
        availableBikes: 0,
        totalDocks: 10,
        openingTime: "6:00",
        closingTime: "22:00",
        distance: "2.5km",
        walkingTime: "30 min caminhando",
        imageUrl: "https://pixabay.com/get/g2995bae173ba5bec8b41ce922ebb72a59e0526ebb5bf1e7fd9d6b76611a8969ecd846d0f197fc6d05370783477075e1e5bbb392a38e21577bb96169a580030b3_1280.jpg"
      },
      {
        id: this.stationIdCounter++,
        name: "Estação República",
        address: "Praça da República, 120",
        lat: "-23.542778",
        lng: "-46.642508",
        availableBikes: 5,
        totalDocks: 15,
        openingTime: "6:00",
        closingTime: "22:00",
        distance: "1.5km",
        walkingTime: "18 min caminhando",
        imageUrl: "https://pixabay.com/get/g2995bae173ba5bec8b41ce922ebb72a59e0526ebb5bf1e7fd9d6b76611a8969ecd846d0f197fc6d05370783477075e1e5bbb392a38e21577bb96169a580030b3_1280.jpg"
      },
      {
        id: this.stationIdCounter++,
        name: "Estação Vila Madalena",
        address: "Rua Fradique Coutinho, 320",
        lat: "-23.552775",
        lng: "-46.689884",
        availableBikes: 3,
        totalDocks: 8,
        openingTime: "6:00",
        closingTime: "22:00",
        distance: "3.2km",
        walkingTime: "38 min caminhando",
        imageUrl: "https://pixabay.com/get/g2995bae173ba5bec8b41ce922ebb72a59e0526ebb5bf1e7fd9d6b76611a8969ecd846d0f197fc6d05370783477075e1e5bbb392a38e21577bb96169a580030b3_1280.jpg"
      }
    ];
    
    stations.forEach(station => {
      this.stations.set(station.id, station);
    });
    
    // Create sample bikes for Paulista station
    const paulistaBikes: Bike[] = [
      {
        id: this.bikeIdCounter++,
        name: "Bike Urbana #103",
        description: "Aro 26, 7 marchas",
        type: "Urbana",
        batteryLevel: 98,
        wheelSize: "26\"",
        gears: "7 velocidades",
        lastMaintenance: "23/10/2023",
        condition: "Excelente",
        imageUrl: "https://images.unsplash.com/photo-1559348349-86f1f65817fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        stationId: 1
      },
      {
        id: this.bikeIdCounter++,
        name: "Bike Elétrica #058",
        description: "Aro 26, motor 250W",
        type: "Elétrica",
        batteryLevel: 75,
        wheelSize: "26\"",
        gears: "7 velocidades",
        lastMaintenance: "15/10/2023",
        condition: "Boa",
        imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        stationId: 1
      },
      {
        id: this.bikeIdCounter++,
        name: "Bike Urbana #217",
        description: "Aro 29, 21 marchas",
        type: "Urbana",
        batteryLevel: 100,
        wheelSize: "29\"",
        gears: "21 velocidades",
        lastMaintenance: "20/10/2023",
        condition: "Excelente",
        imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        stationId: 1
      }
    ];
    
    paulistaBikes.forEach(bike => {
      this.bikes.set(bike.id, bike);
    });
    
    // Create sample bikes for Ibirapuera station
    const ibirapoeraBikes: Bike[] = [
      {
        id: this.bikeIdCounter++,
        name: "Bike Urbana #125",
        description: "Aro 26, 7 marchas",
        type: "Urbana",
        batteryLevel: 95,
        wheelSize: "26\"",
        gears: "7 velocidades",
        lastMaintenance: "20/10/2023",
        condition: "Excelente",
        imageUrl: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        stationId: 2
      },
      {
        id: this.bikeIdCounter++,
        name: "Bike Elétrica #073",
        description: "Aro 26, motor 350W",
        type: "Elétrica",
        batteryLevel: 85,
        wheelSize: "26\"",
        gears: "7 velocidades",
        lastMaintenance: "18/10/2023",
        condition: "Excelente",
        imageUrl: "https://images.unsplash.com/photo-1557687780-6bfbf53c5B00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        stationId: 2
      }
    ];
    
    ibirapoeraBikes.forEach(bike => {
      this.bikes.set(bike.id, bike);
    });
    
    // Create sample rentals
    const sampleRentals: Rental[] = [
      {
        id: this.rentalIdCounter++,
        userId: 1,
        bikeId: 2,
        stationId: 1,
        planId: 2,
        startTime: format(addDays(new Date(), -5), "yyyy-MM-dd'T'HH:mm:ss"),
        endTime: format(addDays(new Date(), -4), "yyyy-MM-dd'T'HH:mm:ss"),
        price: "R$ 30,00",
        status: "completed"
      },
      {
        id: this.rentalIdCounter++,
        userId: 1,
        bikeId: 4,
        stationId: 2,
        planId: 1,
        startTime: format(addDays(new Date(), -2), "yyyy-MM-dd'T'HH:mm:ss"),
        endTime: format(addDays(new Date(), -2), "yyyy-MM-dd'T'HH:mm:ss"),
        price: "R$ 8,00",
        status: "completed"
      },
      {
        id: this.rentalIdCounter++,
        userId: 1,
        bikeId: 1,
        stationId: 1,
        planId: 2,
        startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        endTime: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
        price: "R$ 30,00",
        status: "active"
      }
    ];
    
    sampleRentals.forEach(rental => {
      this.rentals.set(rental.id, rental);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...userData, 
      id,
      memberSince: new Date().toISOString()
    };
    
    this.users.set(id, user);
    return user;
  }

  // Station operations
  async getStations(): Promise<Station[]> {
    return Array.from(this.stations.values());
  }

  async getStation(id: number): Promise<Station | undefined> {
    return this.stations.get(id);
  }

  async createStation(stationData: InsertStation): Promise<Station> {
    const id = this.stationIdCounter++;
    const station: Station = { 
      ...stationData, 
      id,
      distance: "0m",
      walkingTime: "0 min"
    };
    
    this.stations.set(id, station);
    return station;
  }

  async decreaseStationBikes(id: number): Promise<Station> {
    const station = this.stations.get(id);
    
    if (!station) {
      throw new Error(`Station with id ${id} not found`);
    }
    
    if (station.availableBikes <= 0) {
      throw new Error(`No bikes available at station ${id}`);
    }
    
    const updatedStation = {
      ...station,
      availableBikes: station.availableBikes - 1
    };
    
    this.stations.set(id, updatedStation);
    return updatedStation;
  }

  // Bike operations
  async getBikes(): Promise<Bike[]> {
    return Array.from(this.bikes.values());
  }

  async getBike(id: number): Promise<Bike | undefined> {
    return this.bikes.get(id);
  }

  async getBikesByStation(stationId: number): Promise<Bike[]> {
    return Array.from(this.bikes.values()).filter(
      (bike) => bike.stationId === stationId
    );
  }

  async createBike(bikeData: InsertBike): Promise<Bike> {
    const id = this.bikeIdCounter++;
    const bike: Bike = { ...bikeData, id };
    
    this.bikes.set(id, bike);
    return bike;
  }

  // Rental operations
  async getRentals(): Promise<Rental[]> {
    return Array.from(this.rentals.values());
  }

  async getRental(id: number): Promise<Rental | undefined> {
    return this.rentals.get(id);
  }

  async getRentalsByUser(userId: number): Promise<Rental[]> {
    return Array.from(this.rentals.values()).filter(
      (rental) => rental.userId === userId
    );
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
    
    const id = this.rentalIdCounter++;
    const startTime = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    
    // Enhanced rental object with display fields
    const rental: Rental & { 
      bikeName: string;
      stationName: string;
      planName: string;
    } = {
      ...rentalData,
      id,
      startTime,
      price,
      bikeName: bike.name,
      stationName: station.name,
      planName,
    } as any;
    
    this.rentals.set(id, rental);
    
    // Format start and end times for display
    const formattedRental = {
      ...rental,
      startTime: format(new Date(rental.startTime), "dd/MM/yyyy, HH:mm"),
      endTime: format(new Date(rental.endTime), "dd/MM/yyyy, HH:mm"),
    };
    
    return formattedRental as Rental;
  }
}

export const storage = new MemStorage();
