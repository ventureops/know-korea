"use client";

import { useEffect, useMemo } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface Props {
  initialContent?: string;
  onChange?: (html: string) => void;
}

export default function BlockNoteEditorInner({ initialContent, onChange }: Props) {
  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? tryParseBlockNoteContent(initialContent)
      : undefined,
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
