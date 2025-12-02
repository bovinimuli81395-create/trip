export type ItemType = 'activity' | 'food' | 'transport' | 'hotel' | 'note';

export interface TravelItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  locationName?: string;
  address?: string;
  type: ItemType;
  tips?: string[]; // Important warnings/tips extracted from images
  warning?: string; // For conflicts like the Monday closure
  cost?: string;
}

export interface DayPlan {
  id: string;
  date: string;
  weekday: string;
  items: TravelItem[];
}