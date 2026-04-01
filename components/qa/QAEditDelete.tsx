'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
  qaId: string;
}

export default function QAEditDelete({ qaId }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/qa/${qaId}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/community');
    } else {
      setDeleting(false);
      setShowModal(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/community/${qaId}/edit`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-body font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          Edit
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-body font-medium bg-error/10 text-error hover:bg-error/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
          Delete
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/40" onClick={() => setShowModal(false)}>
          <div
            className="bg-surface-container-lowest rounded-3xl p-6 max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
              Delete this question?
            </h3>
            <p className="text-sm font-body text-on-surface-variant mb-6">
              This action cannot be undone. All comments and likes will also be deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-body font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-body font-bold bg-error text-on-error hover:bg-error/90 transition-all active:scale-95 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
