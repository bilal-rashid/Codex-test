export type UserRole = "admin" | "staff";
export type ShiftType = "day" | "night";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  restaurantId: string;
  locationIds: string[];
  isActive: boolean;
}

export interface Location {
  id: string;
  restaurantId: string;
  name: string;
  timezone: string;
  isActive: boolean;
}

export interface StaffMember {
  id: string;
  userId?: string | null;
  restaurantId: string;
  name: string;
  username: string;
  locationIds?: string[];
  isActive: boolean;
}

export interface CashSubmission {
  id: string;
  staffId: string;
  locationId: string;
  date: string;
  shiftType: ShiftType;
  amount: number;
}

export interface ReportDistribution {
  staffId: string;
  shareAmount: number;
}

export interface TipReport {
  id: string;
  locationId: string;
  date: string;
  shiftType: ShiftType;
  generatedBy: string;
  totalTips: number;
  distributionData: ReportDistribution[];
  locked: boolean;
}
