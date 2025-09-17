// Shared types for Trace-Bit mobile app

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  achievements: Achievement[];
  totalPoints: number;
  ecoScore: number;
}

export interface UserPreferences {
  notifications: boolean;
  backgroundTracking: boolean;
  ecoMode: boolean;
  preferredTransport: TransportMode[];
  privacyLevel: 'low' | 'medium' | 'high';
}

export interface Trip {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  startLocation: Location;
  endLocation?: Location;
  route: RoutePoint[];
  transportMode: TransportMode;
  distance: number;
  duration: number;
  co2Saved: number;
  pointsEarned: number;
  isActive: boolean;
  metadata: TripMetadata;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  timestamp: Date;
}

export interface RoutePoint extends Location {
  speed?: number;
  heading?: number;
  transportMode?: TransportMode;
}

export interface TripMetadata {
  weather?: WeatherData;
  trafficLevel?: number;
  batteryLevel?: number;
  deviceInfo?: DeviceInfo;
  sensorData?: SensorData;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditions: string;
}

export interface DeviceInfo {
  model: string;
  os: string;
  version: string;
  batteryLevel: number;
}

export interface SensorData {
  accelerometer?: { x: number; y: number; z: number };
  gyroscope?: { x: number; y: number; z: number };
  magnetometer?: { x: number; y: number; z: number };
}

export type TransportMode = 
  | 'walking' 
  | 'cycling' 
  | 'public_transport' 
  | 'car' 
  | 'motorcycle' 
  | 'scooter' 
  | 'unknown';

export interface TrafficAlert {
  id: string;
  location: Location;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'congestion' | 'accident' | 'construction' | 'weather';
  description: string;
  estimatedDelay: number;
  timestamp: Date;
  expiresAt: Date;
}

export interface RouteOptimization {
  id: string;
  origin: Location;
  destination: Location;
  options: RouteOption[];
  recommended: RouteOption;
  timestamp: Date;
}

export interface RouteOption {
  id: string;
  transportMode: TransportMode;
  duration: number;
  distance: number;
  co2Emission: number;
  cost?: number;
  steps: RouteStep[];
  trafficLevel: number;
  ecoScore: number;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  transportMode: TransportMode;
  location: Location;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: Date;
  category: 'eco' | 'distance' | 'consistency' | 'exploration';
}

export interface CityAnalytics {
  totalTrips: number;
  totalDistance: number;
  averageEcoScore: number;
  popularRoutes: PopularRoute[];
  trafficPatterns: TrafficPattern[];
  co2Savings: number;
  timestamp: Date;
}

export interface PopularRoute {
  id: string;
  startLocation: Location;
  endLocation: Location;
  frequency: number;
  averageDuration: number;
  transportModes: TransportMode[];
}

export interface TrafficPattern {
  hour: number;
  dayOfWeek: number;
  averageCongestion: number;
  peakHours: boolean;
}

export interface NotificationData {
  id: string;
  type: 'traffic' | 'achievement' | 'route' | 'general';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
