'use client';

const KO_FI_URL =
  'https://ko-fi.com/knowkorea?hidefeed=true&widget=true&embed=true';

const POPUP_SPECS = 'width=480,height=720,scrollbars=yes';

interface KoFiButtonProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function KoFiButton({
  label = 'Buy me a coffee',
  size = 'md',
  className = '',
}: KoFiButtonProps) {
  const handleClick = () => {
    window.open(KO_FI_URL, 'ko-fi-popup', POPUP_SPECS);
  };

  const sizeClasses = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  return (
    <button
      onClick={handleClick}
      className={`
        bg-[#E9C48C] text-[#2D456E]
        rounded-full font-bold
        hover:scale-105 active:scale-95
        transition-transform
        flex items-center gap-2
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label="Support Know Korea on Ko-fi"
    >
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        coffee
      </span>
      {label}
    </button>
  );
}
