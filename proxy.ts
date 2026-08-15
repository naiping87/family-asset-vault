import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // api/keep-alive 供 Vercel Cron 每日保活调用,未登录访问,必须绕过会话校验
    "/((?!_next/static|_next/image|favicon.ico|api/keep-alive|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
