export const PROPERTY_TYPES = [
  { value: 'apartment', label: '公寓', icon: '🏢' },
  { value: 'house', label: '洋房', icon: '🏠' },
  { value: 'land', label: '土地', icon: '🌴' },
  { value: 'shop', label: '商铺', icon: '🏪' },
  { value: 'factory', label: '厂房', icon: '🏭' },
];

export const PROPERTY_STATUS = [
  { value: 'rented', label: '已出租', color: 'green' },
  { value: 'vacant', label: '空置中', color: 'red' },
  { value: 'non_rental', label: '非出租', color: 'gray' },
];

export const INSURANCE_TYPES = [
  { value: 'fire', label: '火险', icon: '🔥' },
  { value: 'flood', label: '水灾险', icon: '🌊' },
  { value: 'home', label: '房屋保险', icon: '🏠' },
  { value: 'mlta', label: 'MLTA', icon: '📋' },
  { value: 'mrta', label: 'MRTA', icon: '📋' },
  { value: 'other', label: '其他', icon: '📄' },
];

export const TAX_TYPES = [
  { value: 'cukai_pintu', label: '门牌税', icon: '🏠' },
  { value: 'cukai_tanah', label: '土地税', icon: '🌴' },
  { value: 'cukai_keuntungan', label: '盈利税', icon: '💰' },
];

export const REMINDER_SEVERITY = {
  danger: { threshold: 30, label: '紧急' },
  warning: { threshold: 90, label: '留意' },
  info: { threshold: Infinity, label: '正常' },
};

export function getReminderSeverity(daysRemaining) {
  if (daysRemaining < 0) return 'danger';
  if (daysRemaining <= 30) return 'danger';
  if (daysRemaining <= 90) return 'warning';
  return 'info';
}

export function getPropertyTypeLabel(type) {
  return PROPERTY_TYPES.find(t => t.value === type)?.label || type;
}

export function getPropertyTypeIcon(type) {
  return PROPERTY_TYPES.find(t => t.value === type)?.icon || '🏘️';
}
