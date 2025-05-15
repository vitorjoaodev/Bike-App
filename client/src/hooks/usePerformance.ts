import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Interface for weekly stats
export interface WeeklyStats {
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  ridesCount: number;
  avgSpeed: number;
  elevationGain: number;
  weeklyGoal: number;
}

// Interface for monthly stats
export interface MonthlyStats {
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  ridesCount: number;
  avgSpeed: number;
  elevationGain: number;
  monthlyGoal: number;
}

// Interface for achievement data
export interface Achievement {
  id: number;
  name: string;
  description: string;
  iconName: string;
  iconColor: string;
  date: string;
}

// Interface for ride history data
export interface Ride {
  id: number;
  date: string;
  start: string;
  end: string;
  distance: number;
  duration: number;
  calories: number;
}

// Interface for performance goals
export interface PerformanceGoals {
  id: number;
  userId: number;
  weeklyDistanceGoal: number;
  weeklyDurationGoal: number;
  weeklyCaloriesGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for setting performance goals
export interface SetGoalsData {
  weeklyDistanceGoal?: number;
  weeklyDurationGoal?: number;
  weeklyCaloriesGoal?: number;
}

// Hook for getting weekly stats
export function useWeeklyStats() {
  return useQuery<WeeklyStats>({
    queryKey: ['/api/performance/weekly'],
  });
}

// Hook for getting monthly stats
export function useMonthlyStats() {
  return useQuery<MonthlyStats>({
    queryKey: ['/api/performance/monthly'],
  });
}

// Hook for getting achievements
export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: ['/api/performance/achievements'],
  });
}

// Hook for getting ride history
export function useRideHistory() {
  return useQuery<Ride[]>({
    queryKey: ['/api/performance/rides'],
  });
}

// Hook for setting performance goals
export function useSetGoals() {
  const queryClient = useQueryClient();
  
  return useMutation<PerformanceGoals, unknown, SetGoalsData>({
    mutationFn: async (data: SetGoalsData) => {
      const response = await fetch('/api/performance/goals', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to update goals');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate necessary queries when goals are updated
      queryClient.invalidateQueries({ queryKey: ['/api/performance/weekly'] });
    },
  });
}

// Utility functions for display formatting
export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function formatSpeed(kmh: number): string {
  return `${kmh.toFixed(1)} km/h`;
}

export function formatCalories(calories: number): string {
  return `${calories} kcal`;
}

export function getGoalPercentage(current: number, goal: number): number {
  return Math.min(Math.round((current / goal) * 100), 100);
}