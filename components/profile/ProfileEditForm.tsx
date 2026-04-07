'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Props {
  userId: string;
  initialNickname: string;
  initialAvatar: string | null;
}

export default function ProfileEditForm({ userId, initialNickname, initialAvatar }: Props) {
  const router = useRouter();
  const { update } = useSession();
  const [nickname, setNickname] = useState(initialNickname);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar ?? '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be under 5MB.');
      return;
    }

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload/avatar', { method: 'POST', body: formData });
    setUploading(false);

    if (!res.ok) {
      setUploadError('Upload failed. Please try again.');
      return;
    }

    const { url } = await res.json();
    setAvatarUrl(url);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim()) { setError('Nickname cannot be empty.'); return; }
    setSaving(true);
    setError('');
    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: nickname.trim(), avatar_url: avatarUrl || null }),
    });
    setSaving(false);
    if (res.ok) {
      await update();
      router.push('/profile');
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? 'Failed to save.');
    }
  }

  async function handleDelete() {
    const res = await fetch('/api/profile/delete', { method: 'POST' });
    if (res.ok) {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Avatar preview + upload */}
      <div className="space-y-4">
        {/* 미리보기 */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-headline font-bold text-3xl text-on-surface">
                {nickname ? nickname[0].toUpperCase() : '?'}
              </span>
            )}
          </div>
        </div>

        {/* Upload Photo 버튼 */}
        <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity active:scale-95">
          {uploading ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              Uploading…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">cloud_upload</span>
              Upload Photo
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>

        {uploadError && (
          <p className="text-xs text-error text-center font-body">{uploadError}</p>
        )}

        {/* or 구분선 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-outline-variant/20" />
          <span className="text-xs text-outline font-body">or</span>
          <div className="flex-1 border-t border-outline-variant/20" />
        </div>

        {/* URL 직접 입력 */}
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="Paste image URL..."
          className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Nickname */}
      <div>
        <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-1">
          Nickname
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={30}
          className="w-full px-4 py-3 rounded-xl bg-surface-container text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="text-xs text-outline mt-1">{nickname.length}/30 characters</p>
      </div>

      {error && (
        <p className="text-sm text-error font-body bg-error/5 px-4 py-2 rounded-xl">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full py-3 rounded-xl bg-primary text-on-primary font-body font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>

      <div className="border-t border-outline-variant/15 pt-6">
        <p className="text-xs font-body text-on-surface-variant mb-4">
          Deleting your account will anonymize your comments and likes. This action cannot be undone.
        </p>
        {showDeleteConfirm ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 py-2.5 rounded-xl bg-error text-on-primary font-body font-bold text-sm hover:opacity-90 transition-all"
            >
              Yes, delete my account
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface font-body text-sm hover:bg-surface-container-high transition-all"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm font-body text-error hover:underline transition-colors"
          >
            Delete account
          </button>
        )}
      </div>
    </form>
  );
}
