import { pgTable, text, serial, integer, boolean, timestamp, foreignKey, json, doublePrecision, date, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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
  status: true,
});

// Define relations after all tables are defined to avoid circular references
export const usersRelations = relations(users, ({ many }) => ({
  rentals: many(rentals),
}));

export const stationsRelations = relations(stations, ({ many }) => ({
  bikes: many(bikes),
  rentals: many(rentals),
}));

export const bikesRelations = relations(bikes, ({ one, many }) => ({
  station: one(stations, {
    fields: [bikes.stationId],
    references: [stations.id],
  }),
  rentals: many(rentals),
}));

export const rentalsRelations = relations(rentals, ({ one }) => ({
  user: one(users, {
    fields: [rentals.userId],
    references: [users.id],
  }),
  bike: one(bikes, {
    fields: [rentals.bikeId],
    references: [bikes.id],
  }),
  station: one(stations, {
    fields: [rentals.stationId],
    references: [stations.id],
  }),
}));

// Performance schema
export const rideStats = pgTable("ride_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  rentalId: integer("rental_id").references(() => rentals.id),
  date: date("date").notNull().defaultNow(),
  duration: integer("duration").notNull(), // in seconds
  distance: doublePrecision("distance").notNull(), // in km
  avgSpeed: doublePrecision("avg_speed").notNull(), // in km/h
  maxSpeed: doublePrecision("max_speed").notNull(), // in km/h
  caloriesBurned: integer("calories_burned").notNull(),
  elevationGain: integer("elevation_gain").notNull(), // in meters
  route: json("route").$type<Array<{lat: number, lng: number, timestamp: number}>>(), // array of coordinates
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRideStatsSchema = createInsertSchema(rideStats).omit({
  id: true,
  createdAt: true,
});

export const userPerformanceGoals = pgTable("user_performance_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  weeklyDistanceGoal: doublePrecision("weekly_distance_goal"), // in km
  weeklyDurationGoal: integer("weekly_duration_goal"), // in minutes
  weeklyCaloriesGoal: integer("weekly_calories_goal"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserPerformanceGoalsSchema = createInsertSchema(userPerformanceGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const achievementTypes = pgTable("achievement_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  criteria: json("criteria").$type<{type: string, value: number}>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementTypeId: integer("achievement_type_id").notNull().references(() => achievementTypes.id),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

export const insertUserAchievementsSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
});

// Relations
export const rideStatsRelations = relations(rideStats, ({ one }) => ({
  user: one(users, {
    fields: [rideStats.userId],
    references: [users.id],
  }),
  rental: one(rentals, {
    fields: [rideStats.rentalId],
    references: [rentals.id],
  }),
}));

export const userPerformanceGoalsRelations = relations(userPerformanceGoals, ({ one }) => ({
  user: one(users, {
    fields: [userPerformanceGoals.userId],
    references: [users.id],
  }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievementType: one(achievementTypes, {
    fields: [userAchievements.achievementTypeId],
    references: [achievementTypes.id],
  }),
}));

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Station = typeof stations.$inferSelect;
export type InsertStation = z.infer<typeof insertStationSchema>;

export type Bike = typeof bikes.$inferSelect;
export type InsertBike = z.infer<typeof insertBikeSchema>;

export type Rental = typeof rentals.$inferSelect;
export type InsertRental = z.infer<typeof insertRentalSchema>;

export type RideStats = typeof rideStats.$inferSelect;
export type InsertRideStats = z.infer<typeof insertRideStatsSchema>;

export type UserPerformanceGoals = typeof userPerformanceGoals.$inferSelect;
export type InsertUserPerformanceGoals = z.infer<typeof insertUserPerformanceGoalsSchema>;

export type AchievementType = typeof achievementTypes.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementsSchema>;
