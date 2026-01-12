export enum TicketType {
  EarlyBird = 'Early Bird',
  Student = 'Student',
  Advance = 'Advance',
  Door = 'Door',
  VIP = 'VIP',
  Double = 'Double (2 pax)',
  MultiDay = 'Multi-Day Pass'
}

export interface TravelExpense {
  id: string;
  name: string; // e.g., "Bass Player Flight"
  cost: number;
  type: 'Transport' | 'Accommodation' | 'Per Diem';
}

export interface Band {
  id: string;
  name: string;
  genre: string;
  location: string;
  members: number;
  guaranteeFee: number; // The "Show Fee"
  travelExpenses: TravelExpense[];
  description?: string;
}

export interface Venue {
  name: string;
  address: string;
  capacity: number;
  baseFee: number; // Guarantee
  hasRevenueShare: boolean;
  revenueSharePercent: number; // e.g., 30 for 30% to venue
  drinksCut: number; // Flat fee or estimate income from drinks to organizer
}

export interface MerchItem {
  id: string;
  name: string;
  unitCost: number;
  sellingPrice: number;
  quantityOrdered: number;
  expectedSales: number;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  totalAllocation: number;
  expectedSales: number;
  isMultiDay: boolean;
  validDays: number[]; // Indices of days valid (0, 1, 2...)
}

export interface ScheduledSet {
  id: string;
  bandId: string;
  dayIndex: number;
  startTime: string;
  endTime: string;
}

export interface EventState {
  title: string;
  days: number;
  venue: Venue;
  bands: Band[];
  merch: MerchItem[];
  otherCosts: { name: string; cost: number }[]; // Marketing, etc.
  tickets: TicketTier[];
  schedule: ScheduledSet[];
}

export const INITIAL_STATE: EventState = {
  title: 'New Event',
  days: 1,
  venue: {
    name: 'Livehouse X',
    address: '',
    capacity: 500,
    baseFee: 3000,
    hasRevenueShare: true,
    revenueSharePercent: 30, // 30% to venue
    drinksCut: 0,
  },
  bands: [],
  merch: [],
  otherCosts: [
    { name: 'Social Media Ads', cost: 500 },
    { name: 'Poster Design', cost: 300 }
  ],
  tickets: [],
  schedule: []
};