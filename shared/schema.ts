import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  imageUrl: text("image_url"),
  memberSince: timestamp("member_since").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  memberSince: true,
});

// Station schema
export const stations = pgTable("stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  availableBikes: integer("available_bikes").notNull(),
  totalDocks: integer("total_docks").notNull(),
  openingTime: text("opening_time").notNull(),
  closingTime: text("closing_time").notNull(),
  imageUrl: text("image_url").notNull(),
  distance: text("distance"),
  walkingTime: text("walking_time"),
});

export const insertStationSchema = createInsertSchema(stations).omit({
  id: true,
  distance: true,
  walkingTime: true,
});

// Bike schema
export const bikes = pgTable("bikes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  batteryLevel: integer("battery_level").notNull(),
  wheelSize: text("wheel_size").notNull(),
  gears: text("gears").notNull(),
  lastMaintenance: text("last_maintenance").notNull(),
  condition: text("condition").notNull(),
  imageUrl: text("image_url").notNull(),
  stationId: integer("station_id").notNull().references(() => stations.id),
});

export const insertBikeSchema = createInsertSchema(bikes).omit({
  id: true,
});

// Rental schema
export const rentals = pgTable("rentals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bikeId: integer("bike_id").notNull().references(() => bikes.id),
  stationId: integer("station_id").notNull().references(() => stations.id),
  planId: integer("plan_id").notNull(),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time").notNull(),
  price: text("price").notNull(),
  status: text("status").notNull().default("active"),
});

export const insertRentalSchema = createInsertSchema(rentals).omit({
  id: true,
  startTime: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Station = typeof stations.$inferSelect;
export type InsertStation = z.infer<typeof insertStationSchema>;

export type Bike = typeof bikes.$inferSelect;
export type InsertBike = z.infer<typeof insertBikeSchema>;

export type Rental = typeof rentals.$inferSelect;
export type InsertRental = z.infer<typeof insertRentalSchema>;
