'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function QAEditor({ content, onChange, placeholder = 'Describe your question in detail…' }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[180px] px-4 py-3 font-body text-sm text-on-surface leading-relaxed focus:outline-none',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-xl bg-surface-container focus-within:ring-2 focus-within:ring-primary/30 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-surface-container-high border-b border-outline-variant/15">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          label="B"
          title="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          label="I"
          title="Italic"
          className="italic"
        />
        <div className="w-px h-4 bg-outline-variant/30 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon="format_list_bulleted"
          title="Bullet list"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon="format_list_numbered"
          title="Numbered list"
        />
        <div className="w-px h-4 bg-outline-variant/30 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon="format_quote"
          title="Blockquote"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          icon="code"
          title="Inline code"
        />
      </div>

      {/* Editor area */}
      <div className="relative">
        {editor.isEmpty && (
          <p className="absolute top-3 left-4 text-sm font-body text-outline pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  label,
  icon,
  title,
  className = '',
}: {
  onClick: () => void;
  active: boolean;
  label?: string;
  icon?: string;
  title: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center w-7 h-7 rounded-lg text-sm transition-all active:scale-95 ${
        active
          ? 'bg-primary text-on-primary'
          : 'text-on-surface-variant hover:bg-surface-container-highest'
      } ${className}`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
      ) : (
        <span className="font-bold text-xs">{label}</span>
      )}
    </button>
  );
}
