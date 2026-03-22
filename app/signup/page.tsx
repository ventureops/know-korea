import Link from "next/link";

const features = [
  { icon: "article", title: "Expert Guides & Community Interaction", desc: "Write comments on articles, share your perspectives, and engage with a vibrant community of like-minded individuals." },
  { icon: "forum", title: "Q&A with Locals", desc: "Stuck on a niche problem? Ask your own questions and get reliable answers directly from people who know Korea best." },
  { icon: "trending_up", title: "Personalized Activity Tracking", desc: "Keep track of your reading history and 'Mark as Read' to stay organized as you navigate your move or life here." },
  { icon: "favorite", title: "Engagement", desc: "Show appreciation for valuable content. Like posts and questions to support contributors and highlight helpful info." },
  { icon: "emoji_events", title: "Activity Record", desc: "Maintain a personal dashboard of your contributions, saved guides, and earn badges as you help the community grow." },
];

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-stretch">
      {/* Left — Features */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-10 py-12 bg-surface-container-low">
        <div className="max-w-lg">
          <h1 className="font-headline font-extrabold text-5xl text-on-surface tracking-tight mb-3">
            Join the<br />
            <span className="text-primary">Community</span>
          </h1>
          <p className="text-base font-body text-on-surface-variant leading-relaxed mb-10">
            Become a part of the most helpful ecosystem for expats and locals in Korea.
          </p>

          <div className="space-y-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-primary">{f.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm text-on-surface mb-0.5">{f.title}</h3>
                  <p className="text-xs font-body text-on-surface-variant leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-10">
            <div className="flex -space-x-2">
              {["#425C85", "#B31A35", "#4E5A81"].map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-surface-container-low flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <span className="material-symbols-outlined text-[14px] text-on-primary">person</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-body text-on-surface-variant">
              Join <strong className="text-on-surface">12,000+</strong> members today
            </p>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h2 className="font-headline font-extrabold text-2xl text-on-surface mb-1">
              Create your account
            </h2>
            <p className="text-sm font-body text-on-surface-variant">Choose your preferred method</p>
          </div>

          <div className="space-y-3 mb-6">
            {/* Google */}
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-body font-medium text-sm hover:bg-surface-container-low transition-all active:scale-95 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            {/* Apple */}
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-inverse-surface text-on-primary font-body font-medium text-sm hover:opacity-90 transition-all active:scale-95">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Sign up with Apple
            </button>
          </div>

          <p className="text-center text-sm font-body text-on-surface-variant mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:text-primary-dim transition-colors">
              Log in
            </Link>
          </p>

          <p className="text-center text-[10px] font-body text-outline leading-relaxed uppercase tracking-wider">
            By signing up, you agree to our{" "}
            <Link href="/legal#privacy" className="underline hover:text-on-surface-variant transition-colors">
              Privacy Policy
            </Link>{" "}
            &{" "}
            <Link href="/legal#terms" className="underline hover:text-on-surface-variant transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
