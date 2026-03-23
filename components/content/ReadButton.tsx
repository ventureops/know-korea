'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Props {
  contentId: string;
  initialRead: boolean;
}

export default function ReadButton({ contentId, initialRead }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isRead, setIsRead] = useState(initialRead);
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  async function toggle() {
    setLoading(true);
    const res = await fetch('/api/reads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_id: contentId }),
    });
    if (res.ok) {
      const data = await res.json();
      setIsRead(data.read);
      router.refresh();
    }
    setLoading(false);
  }

  const baseClass = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-body font-medium transition-all active:scale-95 disabled:opacity-60';
  const readClass = 'bg-success/10 text-success';
  const unreadClass = 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high';

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={baseClass + ' ' + (isRead ? readClass : unreadClass)}
      aria-label={isRead ? 'Mark as unread' : 'Mark as read'}
    >
      <span
        className="material-symbols-outlined text-[16px]"
        style={{ fontVariationSettings: isRead ? "'FILL' 1" : "'FILL' 0" }}
      >
        {isRead ? 'check_circle' : 'radio_button_unchecked'}
      </span>
      {isRead ? 'Read' : 'Mark as read'}
    </button>
  );
}
