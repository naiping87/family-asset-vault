-- Add loan installment & interest rate to properties
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS loan_installment DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS loan_interest_rate DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]';

-- Add tenant_id_type to tenancies (ic or passport)
ALTER TABLE tenancies
  ADD COLUMN IF NOT EXISTS tenant_id_type TEXT DEFAULT 'ic' CHECK (tenant_id_type IN ('ic', 'passport'));

-- Update taxes CHECK constraint: support both cukai_taksiran and cukai_pintu
ALTER TABLE taxes DROP CONSTRAINT IF EXISTS taxes_tax_type_check;
ALTER TABLE taxes ADD CONSTRAINT taxes_tax_type_check CHECK (tax_type IN ('cukai_tanah', 'cukai_taksiran', 'cukai_pintu', 'cukai_petak', 'other'));

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  expense_type TEXT NOT NULL CHECK (expense_type IN ('utility', 'electricity', 'fire_insurance', 'gated_guarded', 'maintenance', 'other')),
  description TEXT,
  amount DECIMAL(10,2),
  due_date DATE,
  paid_date DATE,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for expenses updated_at
CREATE TRIGGER trg_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index
CREATE INDEX IF NOT EXISTS idx_expenses_property_id ON expenses(property_id);

-- RLS for expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD expenses of their properties" ON expenses FOR ALL
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = expenses.property_id AND properties.user_id = auth.uid()));

-- Update dashboard_stats view to include loan installments
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  p.user_id,
  COUNT(DISTINCT p.id) AS total_properties,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'rented') AS rented_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'vacant') AS vacant_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'non_rental') AS non_rental_count,
  COALESCE(SUM(p.current_value), 0) AS total_value,
  COALESCE(SUM(p.loan_balance), 0) AS total_loan,
  COALESCE(SUM(p.loan_installment), 0) AS total_loan_installment,
  COALESCE(SUM(t.monthly_rent) FILTER (WHERE t.status = 'active'), 0) AS monthly_rental_income,
  COALESCE(COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'active'), 0) AS active_insurances
FROM properties p
LEFT JOIN tenancies t ON t.property_id = p.id
LEFT JOIN insurances i ON i.user_id = p.user_id
GROUP BY p.user_id;
