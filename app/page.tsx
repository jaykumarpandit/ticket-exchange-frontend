'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Train, ArrowRight, Zap, Shield, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { StationInput } from '@/components/station-input';
import type { Station } from '@/lib/stations';

export default function HomePage() {
  const router = useRouter();
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (fromStation) params.set('from', fromStation.code);
    if (toStation) params.set('to', toStation.code);
    router.push(`/tickets?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-primary/80 text-white">
        {/* Decorative rail lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-white"
              style={{
                top: `${15 + i * 14}%`,
                left: '-5%',
                right: '-5%',
                transform: `rotate(${-3 + i * 0.5}deg)`,
              }}
            />
          ))}
        </div>

        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Zap className="h-3.5 w-3.5 text-yellow-300" />
              <span>India's first railway ticket exchange</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Don't let your{' '}
              <span className="text-orange-300">railway ticket</span>{' '}
              go to waste
            </h1>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              Sell your unused Indian Railways tickets and help fellow passengers find seats. Fast, simple, and direct contact.
            </p>

            {/* Search box */}
            <div className="bg-white rounded-2xl p-5 shadow-2xl shadow-black/30 text-left">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                Find Tickets
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
                <StationInput
                  value={fromValue}
                  onSelect={(s) => {
                    setFromStation(s);
                    setFromValue(`${s.name} (${s.code})`);
                  }}
                  placeholder="From station"
                />

                <div className="hidden sm:flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>

                <StationInput
                  value={toValue}
                  onSelect={(s) => {
                    setToStation(s);
                    setToValue(`${s.name} (${s.code})`);
                  }}
                  placeholder="To station"
                />

                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="sm:h-10 w-full sm:w-auto px-6"
                >
                  <Search className="h-4 w-4 mr-1.5" />
                  Search
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 px-1">
                Leave blank to browse all available tickets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-secondary mb-2">How it works</h2>
            <p className="text-muted-foreground">Three simple steps to exchange your ticket</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: '🎫',
                title: 'List your ticket',
                desc: "Add your unused ticket details — train, date, route, and passenger info. Takes less than 2 minutes.",
              },
              {
                step: '02',
                icon: '🔍',
                title: 'Buyer finds it',
                desc: 'Passengers searching for your route will find your listing and see your contact details.',
              },
              {
                step: '03',
                icon: '📱',
                title: 'Connect directly',
                desc: 'Buyer contacts you directly via mobile number. Settle the deal your way — no middlemen.',
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center group">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div className="absolute top-2 right-8 md:right-4 text-6xl font-black text-muted/20 select-none leading-none">
                  {item.step}
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: <Train className="h-5 w-5 text-primary" />,
                title: 'All train classes',
                desc: 'SL, 3A, 2A, 1A, CC, EC and more',
              },
              {
                icon: <Shield className="h-5 w-5 text-primary" />,
                title: 'Google verified',
                desc: 'Only signed-in users can list tickets',
              },
              {
                icon: <Phone className="h-5 w-5 text-primary" />,
                title: 'Direct contact',
                desc: 'Call or message the seller directly',
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-5 rounded-xl bg-white border border-border/60 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-orange-500 text-white text-center">
        <div className="container max-w-xl">
          <h2 className="text-2xl font-bold mb-3">Have an unused ticket?</h2>
          <p className="text-white/80 mb-6 text-sm">
            List it in under 2 minutes and recover your cost. Hundreds of passengers are searching for tickets every day.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="font-semibold text-primary"
            onClick={() => router.push('/tickets/add')}
          >
            Sell My Ticket
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Train className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-foreground">RailSwap</span>
          </div>
          <p>© 2026 RailSwap. Not affiliated with Indian Railways or IRCTC.</p>
        </div>
      </footer>
    </div>
  );
}
