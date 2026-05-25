import { createClient } from "@/lib/supabase/server";
import type { AppFile } from "@/types/database";

export async function uploadFile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const file = formData.get("file") as File;
  const propertyId = (formData.get("property_id") as string) || null;

  if (!file) return { error: "未选择文件" };

  const bucket = "files";
  const filePath = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) return { error: uploadError.message };

  const { data, error } = await supabase
    .from("files")
    .insert({
      user_id: user.id,
      property_id: propertyId,
      bucket_name: bucket,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { file: data as AppFile };
}

export async function getPropertyFiles(propertyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("files")
    .select("*")
    .eq("property_id", propertyId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as AppFile[]) ?? [];
}

export async function deleteFile(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未登录" };

  const { data: fileRecord } = await supabase
    .from("files")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!fileRecord) return { error: "文件未找到" };

  await supabase.storage
    .from(fileRecord.bucket_name)
    .remove([fileRecord.file_path]);

  const { error } = await supabase
    .from("files")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
