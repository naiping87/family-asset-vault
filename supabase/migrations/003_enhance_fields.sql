-- Add missing fields to properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS spa_file_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS geran_file_url TEXT;

COMMENT ON COLUMN properties.spa_file_url IS 'SPA (Sale & Purchase Agreement) 买卖合同文件';
COMMENT ON COLUMN properties.geran_file_url IS 'Geran / Title Deed 地契文件';

-- Add agent fields to insurances
ALTER TABLE insurances ADD COLUMN IF NOT EXISTS agent_name TEXT;
ALTER TABLE insurances ADD COLUMN IF NOT EXISTS agent_phone TEXT;

COMMENT ON COLUMN insurances.agent_name IS '保险代理人姓名';
COMMENT ON COLUMN insurances.agent_phone IS '保险代理人电话';

-- Add passport file to tenancies
ALTER TABLE tenancies ADD COLUMN IF NOT EXISTS tenant_passport_url TEXT;

COMMENT ON COLUMN tenancies.tenant_passport_url IS '租客护照/身份证样本';
