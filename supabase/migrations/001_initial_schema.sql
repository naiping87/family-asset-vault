CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  display_name TEXT,
  avatar_url TEXT,
  preferred_currency TEXT DEFAULT 'MYR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'landed', 'land', 'shop', 'factory')),
  address TEXT,
  city TEXT,
  state TEXT,
  postcode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  purchase_price DECIMAL(12,2),
  current_value DECIMAL(12,2),
  loan_balance DECIMAL(12,2),
  loan_bank TEXT,
  title_deed_no TEXT,
  status TEXT DEFAULT 'vacant' CHECK (status IN ('rented', 'vacant', 'non_rental', 'sold')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Co-owners
CREATE TABLE co_owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  ownership_pct DECIMAL(5,2) NOT NULL CHECK (ownership_pct > 0 AND ownership_pct <= 100),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenancies
CREATE TABLE tenancies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_name TEXT NOT NULL,
  tenant_ic TEXT,
  tenant_phone TEXT,
  tenant_email TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent DECIMAL(10,2),
  deposit DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated')),
  contract_file_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax records
CREATE TABLE taxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tax_type TEXT NOT NULL CHECK (tax_type IN ('cukai_tanah', 'cukai_pintu', 'cukai_petak', 'other')),
  authority TEXT,
  account_no TEXT,
  amount DECIMAL(10,2),
  due_date DATE,
  paid_date DATE,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insurances
CREATE TABLE insurances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  insurance_type TEXT NOT NULL CHECK (insurance_type IN ('fire', 'flood', 'home', 'mortgage', 'other')),
  provider TEXT,
  policy_no TEXT,
  coverage_amount DECIMAL(12,2),
  annual_premium DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  policy_file_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  insurance_id UUID REFERENCES insurances(id) ON DELETE CASCADE,
  tenancy_id UUID REFERENCES tenancies(id) ON DELETE CASCADE,
  tax_id UUID REFERENCES taxes(id) ON DELETE CASCADE,
  bucket_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tenancies_updated_at BEFORE UPDATE ON tenancies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_taxes_updated_at BEFORE UPDATE ON taxes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_insurances_updated_at BEFORE UPDATE ON insurances FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_new_user_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Dashboard stats view
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  p.user_id,
  COUNT(DISTINCT p.id) AS total_properties,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'rented') AS rented_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'vacant') AS vacant_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'non_rental') AS non_rental_count,
  COALESCE(SUM(p.current_value), 0) AS total_value,
  COALESCE(SUM(p.loan_balance), 0) AS total_loan,
  COALESCE(SUM(t.monthly_rent) FILTER (WHERE t.status = 'active'), 0) AS monthly_rental_income,
  COALESCE(COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'active'), 0) AS active_insurances
FROM properties p
LEFT JOIN tenancies t ON t.property_id = p.id
LEFT JOIN insurances i ON i.user_id = p.user_id
GROUP BY p.user_id;

-- Indexes
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_co_owners_property_id ON co_owners(property_id);
CREATE INDEX idx_tenancies_property_id ON tenancies(property_id);
CREATE INDEX idx_taxes_property_id ON taxes(property_id);
CREATE INDEX idx_insurances_user_id ON insurances(user_id);
CREATE INDEX idx_insurances_property_id ON insurances(property_id);
CREATE INDEX idx_files_property_id ON files(property_id);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurances ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own properties" ON properties FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD co-owners of their properties" ON co_owners FOR ALL
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = co_owners.property_id AND properties.user_id = auth.uid()));
CREATE POLICY "Users can CRUD tenancies of their properties" ON tenancies FOR ALL
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = tenancies.property_id AND properties.user_id = auth.uid()));
CREATE POLICY "Users can CRUD taxes of their properties" ON taxes FOR ALL
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = taxes.property_id AND properties.user_id = auth.uid()));
CREATE POLICY "Users can CRUD own insurances" ON insurances FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own files" ON files FOR ALL USING (auth.uid() = user_id);
