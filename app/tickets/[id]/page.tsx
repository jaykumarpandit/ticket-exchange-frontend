'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  IndianRupee,
  MapPin,
  Phone,
  Train,
  User,
  Tag,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Ticket } from '@/types';
import api from '@/lib/api';

const GENDER_LABEL: Record<string, string> = {
  M: 'Male',
  F: 'Female',
  T: 'Transgender',
};

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { status } = useSession();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get<Ticket>(`/tickets/${params.id}`);
        setTicket(res.data);
      } catch {
        setError('Could not load ticket details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated' && params?.id) {
      fetchTicket();
    }
  }, [params, status, router]);

  const journeyDate =
    ticket?.journeyDate ? new Date(ticket.journeyDate + 'T00:00:00') : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container max-w-2xl py-8">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        {status === 'loading' ? (
          <div className="mt-10 h-64 rounded-xl bg-muted animate-pulse" />
        ) : status === 'unauthenticated' ? (
          <div className="mt-10 rounded-xl border border-border/60 bg-muted/20 p-6 text-sm text-muted-foreground">
            Redirecting to login…
          </div>
        ) : loading ? (
          <div className="mt-10 h-64 rounded-xl bg-muted animate-pulse" />
        ) : error ? (
          <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {error}
          </div>
        ) : ticket ? (
          <Card className="shadow-md border border-border/70">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Train className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{ticket.trainName}</CardTitle>
                    <CardDescription>#{ticket.trainNumber}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-xs">
                    {ticket.travelClass}
                  </Badge>
                  <Badge variant={ticket.status === 'sold' ? 'secondary' : 'default'} className="text-xs">
                    {ticket.status === 'sold' ? 'Sold / Closed' : 'Available'}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Route */}
              <div className="rounded-lg bg-muted/40 p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase mb-0.5">From</p>
                  <p className="font-semibold leading-tight truncate">{ticket.fromStation}</p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {ticket.fromStationCode}
                  </p>
                </div>
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs text-muted-foreground uppercase mb-0.5">To</p>
                  <p className="font-semibold leading-tight truncate">{ticket.toStation}</p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {ticket.toStationCode}
                  </p>
                </div>
              </div>

              {/* Journey & booking details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {journeyDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(journeyDate, 'dd MMM yyyy')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span>Quota: {ticket.quota}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    PNR: {ticket.pnr}
                  </span>
                </div>
              </div>

              {/* Passenger */}
              <div className="rounded-lg border border-border/60 p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Passenger
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{ticket.passengerName}</span>
                  <span className="text-muted-foreground">
                    ({GENDER_LABEL[ticket.passengerGender] ?? ticket.passengerGender},{' '}
                    {ticket.passengerAge} yrs)
                  </span>
                  {ticket.seatNumber && (
                    <span className="text-xs rounded-full bg-muted px-2 py-0.5">
                      Seat / Berth: {ticket.seatNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    {ticket.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Seller contact & disclaimer */}
              {ticket.seller && (
                <div className="space-y-3 pt-3 border-t border-border/60">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Seller
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm">
                      <p className="font-medium">{ticket.seller.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Contact the seller directly to discuss payment and transfer.
                      </p>
                    </div>

                    {ticket.seller.mobile ? (
                      <a href={`tel:${ticket.seller.mobile}`}>
                        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-primary text-white px-4 py-1.5 text-xs font-semibold shadow-sm hover:bg-primary/90">
                          <Phone className="h-3.5 w-3.5" />
                          {ticket.seller.mobile}
                        </button>
                      </a>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Seller has hidden their mobile number on public listings.
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] leading-relaxed text-muted-foreground bg-muted/40 rounded-md px-3 py-2">
                    RailSwap only connects buyers and sellers. We do not verify tickets,
                    identities, or payments and we are <strong>not responsible</strong> for
                    any fraud, loss, or dispute between users. Please verify all details and
                    proceed with caution before sharing money or personal information.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}

