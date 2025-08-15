export enum ServiceStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  INACTIVE = "INACTIVE",
}

export interface IService {
  id: string;
  provider_id: string;
  category_id: string;
  sub_category_id?: string;
  name: string;
  price: number;
  description?: string;
  duration_days: number;
  duration_hours: number;
  duration_minutes: number;
  advance_payment_percent: number;
  service_location?: string;
  at_customer_location: boolean;
  images: string[];
  status: ServiceStatus;
  created_at: Date;
  updated_at: Date;
}

export interface IServiceCreate {
  provider_id: string;
  category_id: string;
  sub_category_id?: string;
  name: string;
  price: number;
  description?: string;
  duration_days?: number;
  duration_hours?: number;
  duration_minutes?: number;
  advance_payment_percent?: number;
  service_location?: string;
  at_customer_location?: boolean;
  images?: string[];
}

export interface IServiceUpdate {
  name?: string;
  price?: number;
  description?: string;
  duration_days?: number;
  duration_hours?: number;
  duration_minutes?: number;
  advance_payment_percent?: number;
  service_location?: string;
  at_customer_location?: boolean;
  images?: string[];
  status?: ServiceStatus;
}

export interface IServiceListFilters {
  provider_id?: string;
  category_id?: string;
  sub_category_id?: string;
  status?: ServiceStatus;
  min_price?: number;
  max_price?: number;
  location?: string;
  at_customer_location?: boolean;
  search?: string;
}
