/**
 * 格式化马币金额
 * @param {number} value
 * @param {boolean} [compact=false] 简化格式 (RM 850K)
 * @returns {string}
 */
export function formatRM(value, compact = false) {
  if (value == null) return '—';
  if (compact) {
    if (value >= 1_000_000) return `RM ${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `RM ${(value / 1_000).toFixed(0)}K`;
    return `RM ${value.toLocaleString('en-MY')}`;
  }
  return `RM ${value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * 格式化日期
 * @param {string|Date} date
 * @returns {string} e.g. "2026-06-15"
 */
export function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * 计算剩余天数
 * @param {string|Date} targetDate
 * @returns {number} 正数为剩余天数，负数为已过期天数
 */
export function daysRemaining(targetDate) {
  if (!targetDate) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

/**
 * 获取时间段问候语
 * @returns {string}
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

/**
 * 获取今日日期描述
 * @returns {string} e.g. "2026年5月20日 · 星期三"
 */
export function getTodayDescription() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[now.getDay()];
  return `${year}年${month}月${day}日 · ${weekday}`;
}
