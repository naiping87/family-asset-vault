"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * 闲置超过该阈值后,从后台切回页面时执行一次静默会话恢复。
 * 家庭资产场景使用频率低,恢复时重新加载一次让 SSR 用新 token 重渲染,
 * 远好于"点什么都像冻结"。
 */
const STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30 分钟

/**
 * 会话健康守卫:
 * 1. 监听 onAuthStateChange——token 失效/登出时引导重新登录;
 * 2. 监听 visibilitychange / pageshow——页面长时间闲置后从后台恢复时,
 *    用浏览器端 supabase client 静默刷新 token:
 *    - 刷新成功(仍有 user)→ reload 页面,SSR 携带新 token 重新渲染;
 *    - 刷新失败(会话真正过期)→ 跳转登录页并提示。
 */
export function SessionGuard() {
  const lastActiveRef = useRef<number>(0);
  const handlingRef = useRef(false);

  useEffect(() => {
    lastActiveRef.current = Date.now();
    const supabase = createClient();

    function redirectToLogin() {
      if (window.location.pathname.startsWith("/login")) return;
      window.location.href = "/login?reason=expired";
    }

    async function refreshSession() {
      if (handlingRef.current) return;
      handlingRef.current = true;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // 会话已静默续期:整页重载,让服务端用新 token 重新渲染数据
          window.location.reload();
        } else {
          redirectToLogin();
        }
      } catch {
        redirectToLogin();
      } finally {
        // reload/跳转会销毁页面,这里无需复位;若未跳转则复位以便下次重试
        handlingRef.current = false;
      }
    }

    function onVisibilityChange() {
      const now = Date.now();
      if (document.visibilityState === "visible") {
        const elapsed = now - lastActiveRef.current;
        if (elapsed > STALE_THRESHOLD_MS) {
          void refreshSession();
        }
        lastActiveRef.current = now;
      } else {
        lastActiveRef.current = now;
      }
    }

    function onPageShow() {
      // bfcache 恢复时页面 JS 状态保留,但 token 可能早已过期
      onVisibilityChange();
    }

    // token 过期/失效时,supabase-js 会触发 SIGNED_OUT(自动刷新失败)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        redirectToLogin();
      }
    });

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
