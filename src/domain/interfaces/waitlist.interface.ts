export interface IWaitlist {
  id: string;
  name: string;
  email: string;
  country_code: string;
  phone: string;
  message?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IWaitlistCreate {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  message?: string;
}
