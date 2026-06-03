"use client";

import { useState, useRef, useCallback } from "react";
import { useT } from "@/lib/i18n/provider";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/Toast";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileUploadProps {
  accept?: string;
  propertyId?: string;
  existingFiles?: UploadedFile[];
  onUploaded?: (url: string) => void;
  onDelete?: (id: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function fileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType === "application/pdf") return "📄";
  return "📎";
}

export function FileUpload({
  accept,
  propertyId,
  existingFiles = [],
  onUploaded,
  onDelete,
  onUploadingChange,
}: FileUploadProps) {
  const { t } = useT();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const doUpload = useCallback(async (file: File) => {
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast(t("upload.failed") + "未登录", "error");
        return;
      }

      // Upload directly to Supabase Storage (bypasses Vercel body limit)
      const bucket = "files";
      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        showToast(t("upload.failed") + uploadError.message, "error");
        return;
      }

      // Get signed URL
      const { data: signedData } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);

      if (!signedData?.signedUrl) {
        showToast(t("upload.failed") + "无法获取文件链接", "error");
        return;
      }

      // Tell parent form about the URL
      onUploaded?.(signedData.signedUrl);

      // Add to local file list
      setFiles((prev) => [...prev, {
        id: filePath,
        name: file.name,
        size: file.size,
        type: file.type,
        url: signedData.signedUrl,
      }]);
    } catch (e) {
      showToast(t("upload.failed") + (e instanceof Error ? e.message : "上传出错"), "error");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }, [onUploaded, onUploadingChange, t]);

  const handleDelete = useCallback(async (fileId: string) => {
    if (!fileId) {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      return;
    }
    try {
      const supabase = createClient();
      // Remove from storage
      await supabase.storage.from("files").remove([fileId]);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      onDelete?.(fileId);
      showToast(t("upload.deleted"), "success");
    } catch (e) {
      showToast(t("upload.deleteFailed") + (e instanceof Error ? e.message : ""), "error");
    }
  }, [onDelete, t]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) doUpload(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
    // Reset so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <div
        className="upload-zone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          ...(dragOver ? { borderColor: "var(--brand)", background: "var(--glass-bg-intense)" } : {}),
          ...(uploading ? { opacity: 0.6, pointerEvents: "none" } : {}),
        }}
      >
        <input ref={fileInputRef} type="file" accept={accept} style={{ display: "none" }} onChange={handleChange} />
        <div className="upload-icon">{uploading ? "⏳" : "📁"}</div>
        <div className="upload-text">
          {uploading ? t("upload.uploading") : dragOver ? t("upload.dropText") : t("upload.dragText")}
        </div>
        <div className="upload-hint">{t("upload.hint")}</div>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {files.map((file) => (
            <div key={file.id || file.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: "var(--radius)", background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)", marginBottom: 6, fontSize: 14 }}>
              <span style={{ fontSize: 20 }}>{fileIcon(file.type)}</span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 12, flexShrink: 0 }}>{formatSize(file.size)}</span>
              <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)", fontSize: 13, flexShrink: 0 }}>
                {t("common.view")}
              </a>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16, padding: "2px 4px", flexShrink: 0 }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
