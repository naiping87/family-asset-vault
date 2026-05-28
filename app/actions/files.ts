"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadFileAction(formData: FormData) {
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

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

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

  return {
    url: publicUrlData.publicUrl,
    file: { id: data.id, name: file.name, size: file.size, type: file.type } as UploadedFileInfo,
  };
}

export async function deleteFileAction(id: string) {
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

export async function getPropertyFilesAction(propertyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("files")
    .select("*")
    .eq("property_id", propertyId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((f) => {
    const { data: publicUrlData } = supabase.storage
      .from(f.bucket_name)
      .getPublicUrl(f.file_path);
    return {
      id: f.id,
      name: f.file_name,
      size: f.file_size,
      type: f.mime_type,
      url: publicUrlData.publicUrl,
      created_at: f.created_at,
    };
  });
}

export interface UploadedFileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  created_at?: string;
}
