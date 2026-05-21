export interface Profile {
  id: string;
  full_name: string;
  display_name?: string;
  avatar_url?: string;
  preferred_currency: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  name: string;
  property_type: "apartment" | "landed" | "land" | "shop" | "factory";
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
  purchase_price?: number;
  current_value?: number;
  loan_balance?: number;
  loan_bank?: string;
  title_deed_no?: string;
  status: "rented" | "vacant" | "non_rental" | "sold";
  created_at: string;
  updated_at: string;
}

export interface CoOwner {
  id: string;
  property_id: string;
  name: string;
  email?: string;
  ownership_pct: number;
  is_primary: boolean;
  created_at: string;
}

export interface Tenancy {
  id: string;
  property_id: string;
  tenant_name: string;
  tenant_ic?: string;
  tenant_phone?: string;
  tenant_email?: string;
  start_date: string;
  end_date: string;
  monthly_rent?: number;
  deposit?: number;
  status: "active" | "expired" | "terminated";
  contract_file_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Tax {
  id: string;
  property_id: string;
  tax_type: "cukai_tanah" | "cukai_pintu" | "cukai_petak" | "other";
  authority?: string;
  account_no?: string;
  amount?: number;
  due_date?: string;
  paid_date?: string;
  status: "unpaid" | "paid" | "overdue";
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Insurance {
  id: string;
  user_id: string;
  property_id?: string;
  insurance_type: "fire" | "flood" | "home" | "mortgage" | "other";
  provider?: string;
  policy_no?: string;
  coverage_amount?: number;
  annual_premium?: number;
  start_date?: string;
  end_date?: string;
  status: "active" | "expired" | "cancelled";
  policy_file_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppFile {
  id: string;
  user_id: string;
  property_id?: string;
  insurance_id?: string;
  tenancy_id?: string;
  tax_id?: string;
  bucket_name: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
}
