import { createClient } from "@/lib/supabase/server";

/** 渲染文件链接时的签名有效期(秒)。每次页面渲染都会重新签名,链接始终新鲜 */
export const FILE_URL_EXPIRY = 60 * 60 * 24 * 7; // 7 天

/**
 * 从 Supabase signed URL 中解析出 bucket 和文件路径。
 * 例如 https://xxx.supabase.co/storage/v1/object/sign/files/abc/1.pdf?token=...
 * → { bucket: "files", path: "abc/1.pdf" }
 * 非 signed URL(外链、公开 URL、纯路径)返回 null。
 */
export function getFileKey(url: string): { bucket: string; path: string } | null {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/^\/storage\/v1\/object\/sign\/([^/]+)\/(.+)$/);
    if (!m) return null;
    return {
      bucket: decodeURIComponent(m[1]),
      path: decodeURIComponent(m[2]),
    };
  } catch {
    return null;
  }
}

/**
 * 刷新文件链接:数据库里存的是 7 天前生成的 signed URL,已过期。
 * 渲染时对 signed URL 重新签名,保证"查看文件"永远可用。
 * 非 Supabase signed URL(外链/公开 URL)原样返回。
 */
export async function refreshFileUrl(
  url: string | null | undefined,
  expiresIn: number = FILE_URL_EXPIRY
): Promise<string> {
  if (!url) return "";
  const key = getFileKey(url);
  if (!key) return url;

  const supabase = await createClient();
  const { data } = await supabase.storage
    .from(key.bucket)
    .createSignedUrl(key.path, expiresIn);

  return data?.signedUrl ?? url;
}
