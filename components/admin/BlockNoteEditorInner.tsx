"use client";

import { useCallback } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

interface Props {
  initialContent?: string;
  onChange?: (html: string) => void;
}

async function handleUpload(file: File): Promise<string> {
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
  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? tryParseBlockNoteContent(initialContent)
      : undefined,
    uploadFile: handleUpload,
  });

  const handleChange = useCallback(async () => {
    if (!onChange) return;
    const html = await editor.blocksToHTMLLossy(editor.document);
    onChange(html);
  }, [editor, onChange]);

  return (
    <div className="bn-container min-h-[256px] py-4">
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={handleChange}
      />
    </div>
  );
}

function tryParseBlockNoteContent(content: string) {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON, treat as HTML/plain text — BlockNote will use empty doc
  }
  return undefined;
}
