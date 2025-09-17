export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

export interface TripData {
  id: string;
  startTime: Date;
  endTime?: Date;
  startLocation: LocationData;
  endLocation?: LocationData;
  route: LocationData[];
  distance: number;
  duration: number;
  mode: string;
  purpose: string;
  accompanyingTravelers: number;
  isAutomatic: boolean;
  status: 'active' | 'completed' | 'paused';
}

class TripTrackingService {
  private currentTrip: TripData | null = null;
  private watchId: number | null = null;
  private onLocationUpdate: ((location: LocationData) => void) | null = null;
  private onTripUpdate: ((trip: TripData) => void) | null = null;

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    if (typeof window !== 'undefined' && 'navigator' in window && 'geolocation' in navigator) {
      console.log('GPS tracking service initialized');
    } else {
      console.warn('GPS not available, using mock data');
    }
  }

  startTripTracking(
    onLocationUpdate: (location: LocationData) => void,
    onTripUpdate: (trip: TripData) => void
  ): Promise<TripData> {
    return new Promise((resolve, reject) => {
      this.onLocationUpdate = onLocationUpdate;
      this.onTripUpdate = onTripUpdate;

      const startLocation: LocationData = {
        latitude: 12.9716 + (Math.random() - 0.5) * 0.01,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.01,
        accuracy: 5,
        timestamp: new Date(),
      };

      this.currentTrip = {
        id: Date.now().toString(),
        startTime: new Date(),
        startLocation,
        route: [startLocation],
        distance: 0,
        duration: 0,
        mode: '',
        purpose: '',
        accompanyingTravelers: 0,
        isAutomatic: true,
        status: 'active',
      };

      if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition(
          (position) => {
            const location: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date(),
            };

            this.updateTripLocation(location);
            onLocationUpdate(location);
          },
          (error) => {
            console.error('GPS error:', error);
            this.useMockLocationData();
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000,
          }
        );
      } else {
        this.useMockLocationData();
      }

      resolve(this.currentTrip);
    });
  }

  private useMockLocationData() {
    const mockLocations = [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9726, lng: 77.5956 },
      { lat: 12.9736, lng: 77.5966 },
      { lat: 12.9746, lng: 77.5976 },
      { lat: 12.9756, lng: 77.5986 },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockLocations.length && this.currentTrip) {
        const location: LocationData = {
          latitude: mockLocations[index].lat + (Math.random() - 0.5) * 0.001,
          longitude: mockLocations[index].lng + (Math.random() - 0.5) * 0.001,
          accuracy: 10,
          timestamp: new Date(),
        };

        this.updateTripLocation(location);
        if (this.onLocationUpdate) {
          this.onLocationUpdate(location);
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5000);
  }

  private updateTripLocation(location: LocationData) {
    if (this.currentTrip) {
      this.currentTrip.route.push(location);
      this.currentTrip.distance = this.calculateDistance(this.currentTrip.route);
      this.currentTrip.duration = Math.floor(
        (new Date().getTime() - this.currentTrip.startTime.getTime()) / 1000 / 60
      );

      if (this.onTripUpdate) {
        this.onTripUpdate({ ...this.currentTrip });
      }
    }
  }

  private calculateDistance(route: LocationData[]): number {
    if (route.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < route.length; i++) {
      const prev = route[i - 1];
      const curr = route[i];
      totalDistance += this.haversineDistance(prev, curr);
    }
    return totalDistance;
  }

  private haversineDistance(loc1: LocationData, loc2: LocationData): number {
    const R = 6371;
    const dLat = this.toRadians(loc2.latitude - loc1.latitude);
    const dLon = this.toRadians(loc2.longitude - loc1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(loc1.latitude)) *
        Math.cos(this.toRadians(loc2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  stopTripTracking(): TripData | null {
    if (this.currentTrip) {
      this.currentTrip.endTime = new Date();
      this.currentTrip.duration = Math.floor(
        (this.currentTrip.endTime.getTime() - this.currentTrip.startTime.getTime()) / 1000 / 60
      );
      this.currentTrip.status = 'completed';

      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }

      const completedTrip = { ...this.currentTrip };
      this.currentTrip = null;
      return completedTrip;
    }
    return null;
  }

  pauseTripTracking(): void {
    if (this.currentTrip) {
      this.currentTrip.status = 'paused';
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
    }
  }

  resumeTripTracking(): void {
    if (this.currentTrip && this.currentTrip.status === 'paused') {
      this.currentTrip.status = 'active';
      if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition(
          (position) => {
            const location: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date(),
            };

            this.updateTripLocation(location);
            if (this.onLocationUpdate) {
              this.onLocationUpdate(location);
            }
          },
          (error) => {
            console.error('GPS error:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000,
          }
        );
      }
    }
  }

  getCurrentTrip(): TripData | null {
    return this.currentTrip;
  }

  detectTransportMode(route: LocationData[]): string {
    if (route.length < 2) return 'unknown';

    const avgSpeed = this.calculateAverageSpeed(route);
    
    if (avgSpeed < 2) return 'walking';
    if (avgSpeed < 15) return 'cycling';
    if (avgSpeed < 30) return 'public_transport';
    if (avgSpeed < 60) return 'car';
    return 'unknown';
  }

  private calculateAverageSpeed(route: LocationData[]): number {
    if (route.length < 2) return 0;

    let totalDistance = 0;
    let totalTime = 0;

    for (let i = 1; i < route.length; i++) {
      const prev = route[i - 1];
      const curr = route[i];
      const distance = this.haversineDistance(prev, curr);
      const time = (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000 / 3600;

      totalDistance += distance;
      totalTime += time;
    }

    return totalTime > 0 ? totalDistance / totalTime : 0;
  }

  saveTripToLocal(trip: TripData): void {
    const trips = this.getLocalTrips();
    trips.unshift(trip);
    localStorage.setItem('userTrips', JSON.stringify(trips));
  }

  getLocalTrips(): TripData[] {
    const trips = localStorage.getItem('userTrips');
    return trips ? JSON.parse(trips) : [];
  }

  syncWithServer(trip: TripData): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Syncing trip with server:', trip.id);
        resolve(true);
      }, 1000);
    });
  }

  clearLocalData(): void {
    localStorage.removeItem('userTrips');
  }
}

const tripTrackingService = new TripTrackingService();
export default tripTrackingService;
