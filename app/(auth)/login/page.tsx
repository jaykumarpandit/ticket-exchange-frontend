'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Train } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if (!session?.user?.isProfileComplete) {
        router.push('/profile/setup');
      } else {
        router.push('/');
      }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-border/50 overflow-hidden">
          {/* Top bar */}
          <div className="h-2 bg-gradient-to-r from-primary via-orange-400 to-secondary" />

          <div className="p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                <Train className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-secondary">
                Rail<span className="text-primary">Swap</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Indian Railway Ticket Exchange
              </p>
            </div>

            {/* Tagline */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Welcome aboard!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Buy and sell unused railway tickets easily. Help fellow passengers find seats and recover your ticket cost.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: '🎫', label: 'Sell unused tickets' },
                { icon: '🔍', label: 'Find available tickets' },
                { icon: '📱', label: 'Direct contact' },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-accent/50"
                >
                  <span className="text-xl">{f.icon}</span>
                  <p className="text-xs text-center text-muted-foreground leading-tight font-medium">
                    {f.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Sign in button */}
            <Button
              size="lg"
              className="w-full text-base font-semibold"
              onClick={() => signIn('google', { callbackUrl: '/auth-callback' })}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
