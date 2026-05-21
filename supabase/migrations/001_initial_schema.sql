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
