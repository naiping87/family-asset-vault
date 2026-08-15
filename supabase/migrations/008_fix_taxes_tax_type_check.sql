-- 修复 taxes_tax_type_check 约束缺失 'cukai_taksiran' 的问题。
-- 背景:001 的旧约束不含 cukai_taksiran;005 已更新约束,
-- 但部分环境(如手动建表)未应用 005,导致前端提交 cukai_taksiran 时报
-- "new row for relation taxes violates check constraint taxes_tax_type_check"。
-- 本 migration 幂等,可重复执行。

ALTER TABLE taxes DROP CONSTRAINT IF EXISTS taxes_tax_type_check;
ALTER TABLE taxes ADD CONSTRAINT taxes_tax_type_check
  CHECK (tax_type IN ('cukai_tanah', 'cukai_taksiran', 'cukai_pintu', 'cukai_petak', 'other'));
