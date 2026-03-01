export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  mobile?: string;
  mobileVisible?: 'anyone' | 'buyer';
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  fromStationCode: string;
  toStation: string;
  toStationCode: string;
  journeyDate: string;
  pnr: string;
  travelClass: string;
  quota: string;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
  seatNumber?: string;
  price: number;
  status: 'available' | 'sold';
  createdAt: string;
  updatedAt: string;
  seller?: {
    id: string;
    name: string;
    avatar?: string;
    mobile?: string;
    mobileVisible?: string;
  };
}

export const TRAVEL_CLASSES = [
  { value: 'SL', label: 'Sleeper (SL)' },
  { value: '3A', label: 'Third AC (3A)' },
  { value: '2A', label: 'Second AC (2A)' },
  { value: '1A', label: 'First AC (1A)' },
  { value: 'CC', label: 'Chair Car (CC)' },
  { value: 'EC', label: 'Executive Chair Car (EC)' },
  { value: '2S', label: 'Second Seating (2S)' },
  { value: 'FC', label: 'First Class (FC)' },
] as const;

export const QUOTAS = [
  { value: 'GN', label: 'General (GN)' },
  { value: 'TQ', label: 'Tourist Quota (TQ)' },
  { value: 'LD', label: 'Ladies Quota (LD)' },
  { value: 'PH', label: 'Physically Handicapped (PH)' },
  { value: 'SS', label: 'Side Lower Berth (SS)' },
  { value: 'HO', label: 'Head Quarter (HO)' },
  { value: 'DF', label: 'Defence Quota (DF)' },
] as const;

export const GENDERS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'T', label: 'Transgender' },
] as const;
