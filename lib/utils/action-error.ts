import { showToast } from "@/components/ui/Toast";

/** 会话失效类错误:统一引导重新登录,而不是只弹一个让人困惑的 toast */
const SESSION_ERROR_PATTERNS: RegExp[] = [
  /^未登录$/,
  /auth session missing/i,
  /jwt expired/i,
  /invalid jwt/i,
  /token.*expired/i,
  /invalid claim/i,
  /refresh token/i,
];

/**
 * 统一处理 server action 返回的错误:
 * - 会话过期/未登录 → 提示后跳转登录页;
 * - 其他错误 → 原样 toast 展示。
 *
 * @returns 是否已消费该错误(有 error 时返回 true)
 */
export function handleActionError(
  result: { error?: string; [key: string]: unknown } | null | undefined
): boolean {
  if (!result || typeof result !== "object") return false;

  const message = typeof result.error === "string" ? result.error : "";
  if (!message) return false;

  const isSessionError = SESSION_ERROR_PATTERNS.some((re) => re.test(message));

  if (isSessionError) {
    showToast("会话已过期,请重新登录", "error");
    setTimeout(() => {
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?reason=expired";
      }
    }, 1200);
    return true;
  }

  showToast(message, "error");
  return true;
}
