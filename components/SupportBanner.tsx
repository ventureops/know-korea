"use client";

export default function SupportBanner() {
  return (
    <div className="bg-[#2d3a4f] rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-white/90 text-sm font-bold">
        Help keep this content free for everyone.
      </p>

      <button
        onClick={() => {
          window.open(
            "https://ko-fi.com/knowkorea?hidefeed=true",
            "ko-fi-popup",
            "width=560,height=900,scrollbars=yes"
          );
        }}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#E9C48C] text-[#2D456E] rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
      >
        <span
          className="material-symbols-outlined text-lg"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          coffee
        </span>
        Buy Us a Coffee
      </button>
    </div>
  );
}
