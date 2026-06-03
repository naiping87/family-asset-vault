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

function validateFile(file: File): string | null {
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) return `文件超过50MB限制 (${formatSize(file.size)})`;
  if (file.size === 0) return "文件为空";
  return null;
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
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const doUpload = useCallback(async (file: File) => {
    // Validate
    const err = validateFile(file);
    if (err) { showToast(err, "error"); return; }

    setUploading(true);
    setProgress(0);
    onUploadingChange?.(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { showToast("请先登录", "error"); return; }

      const bucket = "files";
      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      // Animate progress while uploading
      const progressTimer = setInterval(() => {
        setProgress((p) => Math.min(p + Math.random() * 25, 90));
      }, 300);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: false });

      clearInterval(progressTimer);

      if (uploadError) {
        setProgress(0);
        showToast("上传失败: " + uploadError.message, "error");
        return;
      }

      setProgress(100);

      // Get signed URL
      const { data: signedData } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);

      if (!signedData?.signedUrl) {
        showToast("上传成功但无法生成链接，请重试", "error");
        return;
      }

      onUploaded?.(signedData.signedUrl);
      setFiles((prev) => [...prev, {
        id: filePath,
        name: file.name, size: file.size, type: file.type,
        url: signedData.signedUrl,
      }]);
    } catch (e) {
      setProgress(0);
      showToast("上传失败: " + (e instanceof Error ? e.message : "网络错误，请重试"), "error");
    } finally {
      setTimeout(() => { setUploading(false); setProgress(0); }, 800);
      onUploadingChange?.(false);
    }
  }, [onUploaded, onUploadingChange, t]);

  const handleDelete = useCallback(async (fileId: string) => {
    if (!fileId) { setFiles((prev) => prev.filter((f) => f.id !== fileId)); return; }
    try {
      const supabase = createClient();
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      {/* Upload zone */}
      <div
        className="upload-zone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          ...(dragOver ? { borderColor: "var(--brand)", background: "var(--glass-bg-intense)" } : {}),
          ...(uploading ? { opacity: 0.7, pointerEvents: "none" } : {}),
        }}
      >
        <input ref={fileInputRef} type="file" accept={accept} style={{ display: "none" }} onChange={handleChange} />
        <div className="upload-icon">{uploading ? "⏳" : "📁"}</div>
        <div className="upload-text">
          {uploading && progress > 0
            ? `${t("upload.uploading")} ${Math.round(progress)}%`
            : uploading
            ? t("upload.uploading")
            : dragOver
            ? t("upload.dropText")
            : t("upload.dragText")}
        </div>
        <div className="upload-hint">{t("upload.hint")}</div>
      </div>

      {/* Progress bar */}
      {uploading && (
        <div style={{ marginTop: 8, width: "100%", height: 4, background: "var(--glass-border)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: progress === 100 ? "var(--success)" : "var(--brand)",
            transition: "width 0.3s ease",
            borderRadius: 2,
          }} />
        </div>
      )}

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {files.map((file) => (
            <div key={file.id || file.name} className="file-item" style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px", borderRadius: "var(--radius)",
              background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)",
              marginBottom: 6, fontSize: 14,
            }}>
              <span style={{ fontSize: 20 }}>{fileIcon(file.type)}</span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 12, flexShrink: 0 }}>{formatSize(file.size)}</span>
              <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)", fontSize: 13, flexShrink: 0 }}>
                {t("common.view")}
              </a>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16, padding: "2px 4px", flexShrink: 0 }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
