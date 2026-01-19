export interface PickupPoint {
  id: string | number;
  name: string;
  address: string;
  city: string;
  country: string;
  isActive: boolean;
  workingHours?: string;
  phone?: string;
  hours?: string;
 
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
