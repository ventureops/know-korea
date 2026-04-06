"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function CommunitySearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  function navigate(q: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/community?${qs}` : "/community");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 min-w-0">
      <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2 border border-outline-variant/15">
        <button
          type="submit"
          aria-label="Search"
          className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search discussions..."
          className="flex-1 bg-transparent font-body text-sm text-on-surface placeholder:text-outline outline-none min-w-0"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              navigate("");
            }}
            className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    </form>
  );
}
