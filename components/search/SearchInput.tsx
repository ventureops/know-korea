"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  // Sync when URL changes (e.g. browser back/forward)
  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="flex items-center gap-3 bg-surface-container-lowest rounded-2xl px-4 py-3 shadow-sm border border-outline-variant/15">
        <button
          type="submit"
          aria-label="Search"
          className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search guides, topics..."
          className="flex-1 bg-transparent font-body text-sm text-on-surface placeholder:text-outline outline-none"
          autoFocus
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              router.push("/search");
            }}
            className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    </form>
  );
}
