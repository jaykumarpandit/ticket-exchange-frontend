'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchStations, type Station } from '@/lib/stations';
import { cn } from '@/lib/utils';

interface StationInputProps {
  value: string;
  onSelect: (station: Station) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const DEBOUNCE_MS = 300;

export function StationInput({
  value,
  onSelect,
  placeholder = 'Search station...',
  className,
  id,
}: StationInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Station[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = useCallback((q: string) => {
    setQuery(q);
    setResults([]);
    setError(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!q || q.trim().length < 2) {
      setOpen(false);
      setLoading(false);
      return;
    }

    setOpen(true);
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      debounceRef.current = null;
      const { stations, error: err } = await searchStations(q, 10);
      setResults(stations);
      setError(err ?? null);
      setLoading(false);
    }, DEBOUNCE_MS);
  }, []);

  const handleSelect = (station: Station) => {
    setQuery(`${station.name} (${station.code})`);
    setOpen(false);
    onSelect(station);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        id={id}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover shadow-md overflow-hidden">
          {loading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">Searching…</div>
          ) : error ? (
            <div className="px-4 py-3 text-sm text-destructive">{error}</div>
          ) : results.length > 0 ? (
            results.map((station) => (
              <button
                key={`${station.code}-${station.name}`}
                type="button"
                className={cn(
                  'w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-accent transition-colors',
                )}
                onMouseDown={() => handleSelect(station)}
              >
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium leading-tight">{station.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {station.city ? `${station.city} · ${station.code}` : station.code}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              No stations found. Try a different search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
