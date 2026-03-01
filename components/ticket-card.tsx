'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import {
  Train,
  Calendar,
  MapPin,
  User,
  Phone,
  ArrowRight,
  IndianRupee,
  Tag,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Ticket } from '@/types';

interface TicketCardProps {
  ticket: Ticket;
  showActions?: boolean;
  onMarkSold?: (id: string) => void;
  onDelete?: (id: string) => void;
  href?: string;
}

const CLASS_COLORS: Record<string, string> = {
  SL: 'bg-blue-100 text-blue-800',
  '3A': 'bg-purple-100 text-purple-800',
  '2A': 'bg-indigo-100 text-indigo-800',
  '1A': 'bg-yellow-100 text-yellow-800',
  CC: 'bg-green-100 text-green-800',
  EC: 'bg-orange-100 text-orange-800',
  '2S': 'bg-gray-100 text-gray-800',
  FC: 'bg-red-100 text-red-800',
};

const GENDER_LABEL: Record<string, string> = {
  M: 'Male',
  F: 'Female',
  T: 'Transgender',
};

export function TicketCard({ ticket, showActions, onMarkSold, onDelete, href }: TicketCardProps) {
  const journeyDate = new Date(ticket.journeyDate + 'T00:00:00');
  const isPast = journeyDate < new Date();

  const cardInner = (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200 border border-border/60">
      {/* Status bar */}
      <div
        className={`h-1 w-full ${
          ticket.status === 'sold'
            ? 'bg-gray-400'
            : isPast
              ? 'bg-yellow-400'
              : 'bg-primary'
        }`}
      />

      <CardContent className="p-5">
        {/* Header: Train info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center">
              <Train className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">{ticket.trainName}</p>
              <p className="text-xs text-muted-foreground">#{ticket.trainNumber}</p>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                CLASS_COLORS[ticket.travelClass] ?? 'bg-gray-100 text-gray-800'
              }`}
            >
              {ticket.travelClass}
            </span>
            {ticket.status === 'sold' && (
              <Badge variant="secondary" className="text-xs">
                Sold
              </Badge>
            )}
            {ticket.status === 'available' && isPast && (
              <Badge variant="warning" className="text-xs">
                Date Passed
              </Badge>
            )}
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-3 mb-4 bg-muted/40 rounded-lg p-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base leading-tight truncate">{ticket.fromStation}</p>
            <p className="text-xs text-muted-foreground font-mono">{ticket.fromStationCode}</p>
          </div>
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0 text-right">
            <p className="font-bold text-base leading-tight truncate">{ticket.toStation}</p>
            <p className="text-xs text-muted-foreground font-mono">{ticket.toStationCode}</p>
          </div>
        </div>

        {/* Details row */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs">
              {format(journeyDate, 'dd MMM yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Tag className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs">Quota: {ticket.quota}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs">
              {GENDER_LABEL[ticket.passengerGender] ?? ticket.passengerGender},{' '}
              {ticket.passengerAge} yrs
            </span>
          </div>
          {ticket.seatNumber && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-xs">Seat: {ticket.seatNumber}</span>
            </div>
          )}
        </div>

        {/* Price & Seller */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <div className="flex items-center gap-1">
            <IndianRupee className="h-4 w-4 text-primary font-bold" />
            <span className="text-lg font-bold text-primary">{ticket.price.toLocaleString('en-IN')}</span>
          </div>

          {ticket.seller && ticket.status === 'available' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={ticket.seller.avatar ?? ''} />
                  <AvatarFallback className="text-xs bg-primary text-white">
                    {ticket.seller.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {ticket.seller.name?.split(' ')[0]}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                Tap to view contact details
              </span>
            </div>
          )}
        </div>

        {/* Owner actions */}
        {showActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-border/60">
            {ticket.status === 'available' && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => onMarkSold?.(ticket.id)}
              >
                Mark as Sold
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              className="flex-1 text-xs"
              onClick={() => onDelete?.(ticket.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href && !showActions) {
    return (
      <Link href={href} className="block h-full">
        {cardInner}
      </Link>
    );
  }

  return cardInner;
}
