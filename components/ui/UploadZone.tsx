"use client";

import { useState, useRef } from "react";
import { uploadFile } from "@/lib/api/files";

interface UploadZoneProps {
  propertyId?: string;
  onUploaded?: () => void;
}

export function UploadZone({ propertyId, onUploaded }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    if (propertyId) formData.set("property_id", propertyId);

    const result = await uploadFile(formData);
    setUploading(false);

    if (result.error) {
      alert("上传失败: " + result.error);
    } else {
      onUploaded?.();
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      className="upload-zone"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      style={dragOver ? { borderColor: "var(--brand)", background: "var(--glass-bg-intense)" } : undefined}
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <div className="upload-icon">{uploading ? "⏳" : "📁"}</div>
      <div className="upload-text">
        {uploading ? "上传中..." : dragOver ? "松开以上传" : "拖拽文件到此处上传"}
      </div>
      <div className="upload-hint">支持 PDF、图片、文档 · 单文件最大 10MB</div>
    </div>
  );
}
