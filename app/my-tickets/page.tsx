'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { TicketCard } from '@/components/ticket-card';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';
import type { Ticket as TicketType } from '@/types';

export default function MyTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetchTickets();
    }
  }, [status]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get<TicketType[]>('/tickets/my');
      setTickets(res.data);
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load your tickets.' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSold = async (id: string) => {
    try {
      await api.patch(`/tickets/${id}/sold`);
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'sold' } : t)));
      toast({ title: 'Marked as sold!' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update ticket.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this ticket listing?')) return;
    try {
      await api.delete(`/tickets/${id}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      toast({ title: 'Ticket deleted.' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete ticket.' });
    }
  };

  const available = tickets.filter((t) => t.status === 'available');
  const sold = tickets.filter((t) => t.status === 'sold');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Tickets</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your listed tickets
            </p>
          </div>
          <Button onClick={() => router.push('/tickets/add')}>
            <Plus className="h-4 w-4 mr-1.5" />
            Sell Ticket
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Ticket className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No tickets yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              List your unused railway tickets and help other passengers find seats.
            </p>
            <Button onClick={() => router.push('/tickets/add')}>
              <Plus className="h-4 w-4 mr-1.5" />
              Sell My First Ticket
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {available.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Active ({available.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {available.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      showActions
                      onMarkSold={handleMarkSold}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {sold.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Sold / Closed ({sold.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                  {sold.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      showActions
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
