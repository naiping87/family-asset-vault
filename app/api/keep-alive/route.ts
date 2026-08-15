import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 由 Vercel Cron 每日触发(见 vercel.json)。
// 必须真实触达数据库(select + update)才会计入 Supabase 的"用户活动",
// 仅返回静态响应无法防止免费项目被暂停。
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error: selectError } = await supabase
      .from("keep_alive")
      .select("touched_at")
      .eq("id", 1)
      .maybeSingle();

    if (selectError) {
      return NextResponse.json(
        { ok: false, error: selectError.message },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("keep_alive")
      .update({ touched_at: new Date().toISOString() })
      .eq("id", 1);

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      previous_touched_at: data?.touched_at ?? null,
      touched_at: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown error" },
      { status: 500 }
    );
  }
}
