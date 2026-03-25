"use client";

import { useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface Props {
  initialContent?: string;
  onChange?: (html: string) => void;
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url;
}

export default function BlockNoteEditorInner({ initialContent, onChange }: Props) {
  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? tryParseBlockNoteContent(initialContent)
      : undefined,
    uploadFile,
  });

  useEffect(() => {
    if (!onChange) return;
    const unsubscribe = editor.onChange(async () => {
      const html = await editor.blocksToHTMLLossy(editor.document);
      onChange(html);
    });
    return unsubscribe;
  }, [editor, onChange]);

  return (
    <div className="min-h-64 py-4">
      <BlockNoteView
        editor={editor}
        theme="light"
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
