-- Add tax account fields to properties
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS tax_account_no TEXT,
  ADD COLUMN IF NOT EXISTS tax_authority TEXT;
