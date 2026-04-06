import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButtons from "@/components/auth/LoginButtons";

export const metadata = {
  title: "Sign In",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-stretch">
      {/* Left — Illustration */}
      <div className="hidden lg:flex flex-1 relative bg-surface-container overflow-hidden items-end p-10">
        <img
          src="https://images.unsplash.com/photo-1538485399081-7191377e8241?w=900&q=80"
          alt="Korea cityscape"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10 max-w-sm">
          <p className="font-headline font-extrabold text-2xl text-surface-container-lowest leading-tight mb-2">
            Experience Korea like a local,<br />powered by digital curation.
          </p>
          <p className="text-sm font-body text-on-primary/60">
            Everything you need to navigate Korea.
          </p>
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/70 via-transparent to-transparent" />
      </div>

      {/* Right — Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="font-headline font-extrabold text-sm tracking-widest text-brand-navy uppercase block mb-6">
              Know<span className="text-tertiary">Korea</span>
            </Link>
            <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-2">
              Welcome back<br />to Know Korea
            </h1>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">
              The easiest way to stay connected with your life in Korea.
            </p>
          </div>

          <LoginButtons />

          <p className="text-center text-sm font-body text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-bold hover:text-primary-dim transition-colors">
              Create an account
            </Link>
          </p>

          <p className="mt-6 text-center text-xs font-body text-outline leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/privacy-policy" className="underline hover:text-on-surface-variant transition-colors">
              Privacy Policy
            </Link>{" "}
            &{" "}
            <Link href="/terms-of-service" className="underline hover:text-on-surface-variant transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
