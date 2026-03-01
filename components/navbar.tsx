'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Train, Plus, Ticket, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
            <Train className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-secondary">
            Rail<span className="text-primary">Swap</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/tickets"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Tickets
          </Link>
          {session && (
            <Link
              href="/my-tickets"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My Tickets
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Button
                size="sm"
                onClick={() => router.push('/tickets/add')}
                className="hidden sm:flex"
              >
                <Plus className="h-4 w-4" />
                Sell Ticket
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={session.user.image ?? ''}
                        alt={session.user.name ?? ''}
                      />
                      <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium truncate">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/my-tickets')}>
                    <Ticket className="mr-2 h-4 w-4" />
                    My Tickets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/tickets/add')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Sell a Ticket
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => router.push('/login')}>Sign In</Button>
          )}
        </div>
      </div>
    </header>
  );
}
