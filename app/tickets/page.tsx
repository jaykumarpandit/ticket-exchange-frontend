'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ArrowRight, SlidersHorizontal, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { TicketCard } from '@/components/ticket-card';
import { StationInput } from '@/components/station-input';
import type { Station } from '@/lib/stations';
import type { Ticket as TicketType } from '@/types';
import axios from 'axios';

function TicketsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [fromValue, setFromValue] = useState(searchParams.get('from') ?? '');
  const [toValue, setToValue] = useState(searchParams.get('to') ?? '');

  const fetchTickets = useCallback(async (from?: string, to?: string) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (from) params.from = from;
      if (to) params.to = to;

      const res = await axios.get<TicketType[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets`,
        { params },
      );
      setTickets(res.data);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const from = searchParams.get('from') ?? undefined;
    const to = searchParams.get('to') ?? undefined;
    fetchTickets(from, to);
  }, [searchParams, fetchTickets]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (fromStation) params.set('from', fromStation.code);
    if (toStation) params.set('to', toStation.code);
    router.push(`/tickets?${params.toString()}`);
  };

  const handleClear = () => {
    setFromStation(null);
    setToStation(null);
    setFromValue('');
    setToValue('');
    router.push('/tickets');
  };

  const hasFilter = searchParams.get('from') || searchParams.get('to');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Search bar */}
      <div className="border-b bg-white shadow-sm">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center max-w-3xl">
            <StationInput
              value={fromValue}
              onSelect={(s) => {
                setFromStation(s);
                setFromValue(`${s.name} (${s.code})`);
              }}
              placeholder="From station"
              className="flex-1"
            />
            <ArrowRight className="h-4 w-4 text-muted-foreground self-center flex-shrink-0 hidden sm:block" />
            <StationInput
              value={toValue}
              onSelect={(s) => {
                setToStation(s);
                setToValue(`${s.name} (${s.code})`);
              }}
              placeholder="To station"
              className="flex-1"
            />
            <Button onClick={handleSearch} className="flex-shrink-0">
              <Search className="h-4 w-4 mr-1.5" />
              Search
            </Button>
            {hasFilter && (
              <Button variant="outline" onClick={handleClear} className="flex-shrink-0">
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {hasFilter ? 'Search Results' : 'All Available Tickets'}
            </h1>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
                {hasFilter && (
                  <>
                    {searchParams.get('from') && ` from ${searchParams.get('from')}`}
                    {searchParams.get('to') && ` to ${searchParams.get('to')}`}
                  </>
                )}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Ticket className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No tickets found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {hasFilter
                ? "No available tickets match your search. Try different stations."
                : "No tickets are listed yet. Be the first to sell your unused ticket!"}
            </p>
            <div className="flex gap-3">
              {hasFilter && (
                <Button variant="outline" onClick={handleClear}>Browse All</Button>
              )}
              <Button onClick={() => router.push('/tickets/add')}>
                Sell a Ticket
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background"><Navbar /></div>}>
      <TicketsContent />
    </Suspense>
  );
}
