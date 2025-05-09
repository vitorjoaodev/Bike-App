import { db } from "./db";
import { users, stations, bikes, rentals } from "@shared/schema";
import { format, addDays } from "date-fns";

// This script initializes the database with sample data
export async function initializeDatabase() {
  try {
    console.log("Starting database initialization...");

    // Create sample user
    const createdUsers = await db.insert(users).values({
      username: "joaosilva",
      password: "password123",
      fullName: "João Silva",
      email: "joao.silva@email.com",
      memberSince: new Date()
    }).returning();
    
    const userId = createdUsers[0].id;
    console.log(`Created user with ID: ${userId}`);

    // Create sample stations
    const stationsData = [
      {
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
    
    const createdStations = await db.insert(stations).values(stationsData).returning();
    console.log(`Created ${createdStations.length} stations`);

    // Get station IDs
    const stationIds = createdStations.map(station => station.id);
    
    // Create bikes for first station (Paulista - id = 1)
    const paulistaBikes = [
      {
        name: "Bike Urbana #103",
        description: "Aro 26, 7 marchas",
        type: "Urbana",
        batteryLevel: 98,
        wheelSize: "26\"",
        gears: "7 velocidades",
        lastMaintenance: "23/10/2023",
        condition: "Excelente",
        imageUrl: "https://images.unsplash.com/photo-1559348349-86f1f65817fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        stationId: stationIds[0]
      },
      {
        name: "Bike Elétrica #058",
        description: "Aro 26, motor 250W",
        type: "Elétrica",
        batteryLevel: 75,
        wheelSize: "26\"",
        gears: "7 velocidades",
        lastMaintenance: "15/10/2023",
        condition: "Boa",
        imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        stationId: stationIds[0]
      },
      {
        name: "Bike Urbana #217",
        description: "Aro 29, 21 marchas",
        type: "Urbana",
        batteryLevel: 100,
        wheelSize: "29\"",
        gears: "21 velocidades",
        lastMaintenance: "20/10/2023",
        condition: "Excelente",
        imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        stationId: stationIds[0]
      }
    ];
    
    const createdPaulistaBikes = await db.insert(bikes).values(paulistaBikes).returning();
    console.log(`Created ${createdPaulistaBikes.length} bikes for station ${stationIds[0]}`);
    
    // Create bikes for second station (Ibirapuera - id = 2)
    const ibirapoeraBikes = [
      {
        name: "Bike Urbana #125",
        description: "Aro 26, 7 marchas",
        type: "Urbana",
        batteryLevel: 95,
        wheelSize: "26\"",
        gears: "7 velocidades",
        lastMaintenance: "20/10/2023",
        condition: "Excelente",
        imageUrl: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        stationId: stationIds[1]
      },
      {
        name: "Bike Elétrica #073",
        description: "Aro 26, motor 350W",
        type: "Elétrica",
        batteryLevel: 85,
        wheelSize: "26\"",
        gears: "7 velocidades",
        lastMaintenance: "18/10/2023",
        condition: "Excelente",
        imageUrl: "https://images.unsplash.com/photo-1557687780-6bfbf53c5B00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        stationId: stationIds[1]
      }
    ];
    
    const createdIbirapoeraBikes = await db.insert(bikes).values(ibirapoeraBikes).returning();
    console.log(`Created ${createdIbirapoeraBikes.length} bikes for station ${stationIds[1]}`);
    
    // Create sample rentals
    const now = new Date();
    const sampleRentals = [
      {
        userId,
        bikeId: createdPaulistaBikes[1].id,
        stationId: stationIds[0],
        planId: 2,
        startTime: addDays(now, -5),
        endTime: addDays(now, -4),
        price: "R$ 30,00",
        status: "completed"
      },
      {
        userId,
        bikeId: createdIbirapoeraBikes[0].id,
        stationId: stationIds[1],
        planId: 1,
        startTime: addDays(now, -2),
        endTime: addDays(now, -2),
        price: "R$ 8,00",
        status: "completed"
      },
      {
        userId,
        bikeId: createdPaulistaBikes[0].id,
        stationId: stationIds[0],
        planId: 2,
        startTime: now,
        endTime: addDays(now, 1),
        price: "R$ 30,00",
        status: "active"
      }
    ];
    
    const createdRentals = await db.insert(rentals).values(sampleRentals).returning();
    console.log(`Created ${createdRentals.length} sample rentals`);
    
    console.log("Database initialization completed successfully!");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
}