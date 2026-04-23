"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

type FileUploadProps = {
  bucket: string;
  folder: string;
  accept: string;
  label: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
};

export function FileUpload({
  bucket,
  folder,
  accept,
  label,
  currentUrl,
  onUpload,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function sanitizeName(name: string) {
    return name
      .replace(/[:#?&%'`''\u2018\u2019\u2013\u2014\u201C\u201D,;!@^~()[\]{}|\\]/g, "")
      .replace(/\s+/g, "_");
  }

  async function handleFile(file: File) {
    setError("");
    setUploading(true);

    const sanitized = sanitizeName(file.name);
    const path = `${folder}/${Date.now()}_${sanitized}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: true });

    if (uploadError) {
      const msg = uploadError.message;
      if (/row-level security/i.test(msg)) {
        setError(
          `Storage RLS blocked upload to "${bucket}". Run supabase-migration-storage-policies.sql in the Supabase SQL editor.`
        );
      } else {
        setError(msg);
      }
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onUpload(data.publicUrl);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const isImage = accept.includes("image");
  const Icon = isImage ? ImageIcon : FileText;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Current file preview */}
      {currentUrl && (
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <Icon size={14} />
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-700 truncate max-w-[300px]"
          >
            {currentUrl.split("/").pop()}
          </a>
          <button
            type="button"
            onClick={() => onUpload("")}
            className="text-gray-400 hover:text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-teal-700 bg-teal-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        {uploading ? (
          <p className="text-sm text-gray-500">Uploading...</p>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Upload size={20} className="text-gray-400" />
            <p className="text-sm text-gray-500">
              Drop file here or click to browse
            </p>
          </div>
        )}
      </div>

      {/* Or paste URL */}
      <input
        type="text"
        placeholder="Or paste URL directly"
        value={currentUrl ?? ""}
        onChange={(e) => onUpload(e.target.value)}
        className="w-full mt-2 px-3 py-2 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
