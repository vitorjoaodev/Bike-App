import { db } from "./db";
import { stations } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function addNewStations() {
  try {
    // Verificar se as estações já existem para evitar duplicação
    const existingStations = await db.select().from(stations).where(
      eq(stations.name, "Parque Ibirapuera")
    );
    
    if (existingStations.length > 0) {
      console.log(`As estações já existem. Já existem ${existingStations.length} estações.`);
      return;
    }
    
    // Novas estações para adicionar
    const newStations = [
      {
        name: "Parque Ibirapuera",
        address: "Av. Pedro Álvares Cabral - Vila Mariana, São Paulo",
        lat: "-23.5874",
        lng: "-46.6576",
        availableBikes: 10,
        totalDocks: 15,
        openingTime: "5:00",
        closingTime: "22:00",
        distance: "3.0km",
        walkingTime: "35 min caminhando",
        imageUrl: "/assets/ibirapuera.jpg"
      },
      {
        name: "Parque Villa Lobos",
        address: "Av. Prof. Fonseca Rodrigues, 2001 - Alto de Pinheiros, São Paulo",
        lat: "-23.54667",
        lng: "-46.72111",
        availableBikes: 8,
        totalDocks: 12,
        openingTime: "5:30",
        closingTime: "21:00",
        distance: "5.2km",
        walkingTime: "65 min caminhando",
        imageUrl: "/assets/villalobos.jpg"
      }
    ];
    
    const createdStations = await db.insert(stations).values(newStations).returning();
    console.log(`Adicionadas ${createdStations.length} novas estações`);
    
    return createdStations;
  } catch (error) {
    console.error("Erro ao adicionar novas estações:", error);
    throw error;
  }
}