// Station type definition
export interface Station {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  availableBikes: number;
  totalDocks: number;
  openingTime: string;
  closingTime: string;
  distance: string;
  walkingTime: string;
  imageUrl: string;
}

// Bike type definition
export interface Bike {
  id: number;
  name: string;
  description: string;
  type: string;
  batteryLevel: number;
  wheelSize: string;
  gears: string;
  lastMaintenance: string;
  condition: string;
  imageUrl: string;
  stationId: number;
}

// Rental plan type
export interface Plan {
  id: number;
  name: string;
  price: string;
  description: string;
  popular: boolean;
}

// Rental type definition
export interface Rental {
  id: number;
  userId: number;
  bikeId: number;
  bikeName: string;
  stationId: number;
  stationName: string;
  planId: number;
  planName: string;
  startTime: string;
  endTime: string;
  price: string;
  status: 'active' | 'completed' | 'cancelled';
}

// User type definition
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  imageUrl?: string;
  memberSince: string;
}
