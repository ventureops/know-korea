"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

interface Props {
  initialContent?: string;
  onChange?: (html: string) => void;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error ?? "Upload failed");
  }
  const data = await res.json();
  return data.url;
}

export default function BlockNoteEditorInner({ initialContent, onChange }: Props) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const contentLoaded = useRef(false);

  const handleUpload = useCallback(async (file: File): Promise<string> => {
    setUploadError(null);
    try {
      return await uploadToCloudinary(file);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
      throw err;
    }
  }, []);

  const editor = useCreateBlockNote({ uploadFile: handleUpload });

  // Load existing content after editor mounts
  useEffect(() => {
    if (!initialContent || contentLoaded.current) return;
    contentLoaded.current = true;
    try {
      const blocks = editor.tryParseHTMLToBlocks(initialContent);
      editor.replaceBlocks(editor.document, blocks);
    } catch {
      // ignore — editor stays empty
    }
  }, [editor, initialContent]);

  const handleChange = useCallback(async () => {
    if (!onChange) return;
    const html = await editor.blocksToHTMLLossy(editor.document);
    onChange(html);
  }, [editor, onChange]);

  return (
    <div className="bn-container min-h-[256px] py-4">
      {uploadError && (
        <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-error-container text-on-error-container text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">error</span>
          Image upload failed: {uploadError}
        </div>
      )}
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={handleChange}
      />
    </div>
  );
}
