import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButtons from "@/components/auth/LoginButtons";

const features = [
  { icon: "article", title: "Expert Guides & Community Interaction", desc: "Write comments on articles, share your perspectives, and engage with a vibrant community of like-minded individuals." },
  { icon: "forum", title: "Q&A with Locals", desc: "Stuck on a niche problem? Ask your own questions and get reliable answers directly from people who know Korea best." },
  { icon: "trending_up", title: "Personalized Activity Tracking", desc: "Keep track of your reading history and 'Mark as Read' to stay organized as you navigate your move or life here." },
  { icon: "favorite", title: "Engagement", desc: "Show appreciation for valuable content. Like posts and questions to support contributors and highlight helpful info." },
  { icon: "emoji_events", title: "Activity Record", desc: "Maintain a personal dashboard of your contributions, saved guides, and earn badges as you help the community grow." },
];

export default async function SignupPage() {
  const session = await getSession();
  if (session) redirect("/");
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

          <LoginButtons />

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
