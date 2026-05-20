-- Family Asset Vault - Initial Schema
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'land', 'shop', 'factory');
CREATE TYPE property_status AS ENUM ('rented', 'vacant', 'non_rental');
CREATE TYPE tax_type AS ENUM ('cukai_pintu', 'cukai_tanah', 'cukai_keuntungan');
CREATE TYPE insurance_type AS ENUM ('fire', 'flood', 'home', 'mlta', 'mrta', 'other');
CREATE TYPE file_category AS ENUM ('contract', 'receipt', 'policy', 'title_deed', 'tax_bill', 'photo', 'other');
CREATE TYPE owner_role AS ENUM ('primary', 'joint', 'trustee');

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PROPERTIES
CREATE TABLE properties (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  type            property_type NOT NULL DEFAULT 'apartment',
  status          property_status NOT NULL DEFAULT 'vacant',
  address         TEXT,
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  purchase_price  NUMERIC(12,2),
  current_value   NUMERIC(12,2),
  loan_balance    NUMERIC(12,2),
  loan_bank       TEXT,
  loan_account    TEXT,
  loan_rate       NUMERIC(5,3),
  loan_start_date DATE,
  loan_end_date   DATE,
  monthly_payment NUMERIC(10,2),
  title_deed_no   TEXT,
  title_type      TEXT,
  title_expiry    DATE,
  land_area_sqft  NUMERIC(10,2),
  built_up_sqft   NUMERIC(10,2),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_user ON properties(user_id);
CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- CO_OWNERS
CREATE TABLE co_owners (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id),
  name            TEXT NOT NULL,
  email           TEXT,
  role            owner_role NOT NULL DEFAULT 'joint',
  ownership_pct   NUMERIC(5,2),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_co_owners_property ON co_owners(property_id);
CREATE TRIGGER trg_co_owners_updated_at BEFORE UPDATE ON co_owners FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TENANCIES
CREATE TABLE tenancies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_name     TEXT NOT NULL,
  tenant_ic       TEXT,
  tenant_phone    TEXT,
  tenant_email    TEXT,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  monthly_rent    NUMERIC(10,2) NOT NULL,
  deposit         NUMERIC(10,2),
  utility_deposit NUMERIC(10,2),
  contract_file   TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenancies_property ON tenancies(property_id);
CREATE TRIGGER trg_tenancies_updated_at BEFORE UPDATE ON tenancies FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TAX_RECORDS
CREATE TABLE tax_records (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tax_type        tax_type NOT NULL,
  council         TEXT,
  account_no      TEXT,
  amount          NUMERIC(10,2) NOT NULL,
  due_date        DATE NOT NULL,
  paid            BOOLEAN NOT NULL DEFAULT FALSE,
  paid_date       DATE,
  receipt_file    TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tax_records_property ON tax_records(property_id);
CREATE TRIGGER trg_tax_records_updated_at BEFORE UPDATE ON tax_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- INSURANCES
CREATE TABLE insurances (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID REFERENCES properties(id) ON DELETE SET NULL,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type            insurance_type NOT NULL DEFAULT 'fire',
  company         TEXT NOT NULL,
  policy_no       TEXT NOT NULL,
  sum_insured     NUMERIC(12,2) NOT NULL,
  annual_premium  NUMERIC(10,2) NOT NULL,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  policy_file     TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_insurances_user ON insurances(user_id);
CREATE TRIGGER trg_insurances_updated_at BEFORE UPDATE ON insurances FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- USER_PROFILES
CREATE TABLE user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  avatar_url      TEXT,
  theme           TEXT NOT NULL DEFAULT 'dark',
  language        TEXT NOT NULL DEFAULT 'zh',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_new_user_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- FILES
CREATE TABLE files (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID REFERENCES properties(id) ON DELETE CASCADE,
  insurance_id    UUID REFERENCES insurances(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  storage_path    TEXT NOT NULL,
  size_bytes      BIGINT,
  mime_type       TEXT,
  category        file_category NOT NULL DEFAULT 'other',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_files_property ON files(property_id);
CREATE INDEX idx_files_user ON files(user_id);

-- ROW LEVEL SECURITY
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurances ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own properties" ON properties FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage co-owners of their properties" ON co_owners FOR ALL USING (
  EXISTS (SELECT 1 FROM properties WHERE id = co_owners.property_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage tenancies of their properties" ON tenancies FOR ALL USING (
  EXISTS (SELECT 1 FROM properties WHERE id = tenancies.property_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage tax records of their properties" ON tax_records FOR ALL USING (
  EXISTS (SELECT 1 FROM properties WHERE id = tax_records.property_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage their own insurances" ON insurances FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own files" ON files FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own profile" ON user_profiles FOR ALL USING (auth.uid() = id);

-- DASHBOARD VIEW
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  p.user_id,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'rented') AS rented_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'vacant') AS vacant_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'non_rental') AS non_rental_count,
  COUNT(DISTINCT p.id) AS total_properties,
  COALESCE(SUM(p.current_value), 0) AS total_value,
  COALESCE(SUM(p.loan_balance), 0) AS total_loan,
  COALESCE(SUM(t.monthly_rent) FILTER (WHERE t.end_date >= CURRENT_DATE), 0) AS monthly_rental_income
FROM properties p
LEFT JOIN tenancies t ON t.property_id = p.id
GROUP BY p.user_id;
