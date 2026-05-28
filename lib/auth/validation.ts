export function validatePassword(password: string): string | null {
  if (password.length < 8) return "密码长度至少8位字符";
  if (!/[A-Z]/.test(password) && !/[a-z]/.test(password)) return "密码需包含英文字母";
  if (!/[0-9]/.test(password)) return "密码需包含至少一个数字";
  return null;
}

export function passwordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "弱", color: "var(--danger)" };
  if (score <= 3) return { score, label: "中等", color: "var(--warning)" };
  return { score, label: "强", color: "var(--success)" };
}
