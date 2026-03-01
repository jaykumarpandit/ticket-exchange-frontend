'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Train } from 'lucide-react';

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if (!session?.user?.isProfileComplete) {
        router.replace('/profile/setup');
      } else {
        router.replace('/');
      }
    } else if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
        <Train className="h-7 w-7 text-white" />
      </div>
      <p className="text-muted-foreground text-sm">Signing you in…</p>
    </div>
  );
}
