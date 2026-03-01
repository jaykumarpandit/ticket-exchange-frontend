'use client';

import { useState, useRef, useEffect } from 'react';
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

export function StationInput({
  value,
  onSelect,
  placeholder = 'Search station...',
  className,
  id,
}: StationInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Station[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const handleChange = (q: string) => {
    setQuery(q);
    const found = searchStations(q);
    setResults(found);
    setOpen(found.length > 0);
  };

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
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover shadow-md overflow-hidden">
          {results.map((station) => (
            <button
              key={station.code}
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
                  {station.city} &middot; {station.code}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
