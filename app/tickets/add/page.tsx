'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Train,
  Plus,
  Trash2,
  ArrowLeft,
  Users,
  MapPin,
  Calendar,
  IndianRupee,
  Hash,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/navbar';
import { StationInput } from '@/components/station-input';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { TRAVEL_CLASSES, QUOTAS, GENDERS } from '@/types';
import type { Station } from '@/lib/stations';
import api from '@/lib/api';

const passengerSchema = z.object({
  passengerName: z.string().min(2, 'Name required'),
  passengerAge: z.coerce.number().int().min(1).max(120),
  passengerGender: z.enum(['M', 'F', 'T']),
  seatNumber: z.string().optional(),
});

const schema = z.object({
  trainNumber: z.string().min(1, 'Train number required'),
  trainName: z.string().min(1, 'Train name required'),
  fromStation: z.string().min(1, 'From station required'),
  fromStationCode: z.string().min(1),
  toStation: z.string().min(1, 'To station required'),
  toStationCode: z.string().min(1),
  journeyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  pnr: z.string().min(10, 'PNR must be 10 digits').max(10, 'PNR must be 10 digits'),
  travelClass: z.enum(['SL', '3A', '2A', '1A', 'CC', 'EC', '2S', 'FC']),
  quota: z.enum(['GN', 'TQ', 'LD', 'PH', 'SS', 'HO', 'DF']),
  price: z.coerce.number().int().min(1, 'Price must be at least ₹1'),
  passengers: z.array(passengerSchema).min(1),
});

type FormData = z.infer<typeof schema>;

export default function AddTicketPage() {
  const { data: session, status } = useSession();
  console.log('session', session);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      passengers: [{ passengerName: '', passengerAge: undefined as any, passengerGender: 'M', seatNumber: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'passengers' });

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!session?.user?.isProfileComplete) {
    router.push('/profile/setup');
    return null;
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const created = await api.post('/tickets', data);
      const count = (created.data as any[]).length;
      toast({
        title: `${count} ticket${count > 1 ? 's' : ''} listed!`,
        description: 'Your ticket is now visible to buyers.',
      });
      router.push('/my-tickets');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast({
        variant: 'destructive',
        title: 'Error',
        description: Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Could not list ticket.'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFromSelect = (s: Station) => {
    setValue('fromStation', s.name);
    setValue('fromStationCode', s.code);
  };

  const handleToSelect = (s: Station) => {
    setValue('toStation', s.name);
    setValue('toStationCode', s.code);
  };

  const fromStation = watch('fromStation');
  const toStation = watch('toStation');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster />

      <main className="container max-w-2xl py-8">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">List a Ticket</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in your ticket details. Each passenger creates a separate listing.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Train Details */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-secondary/10 flex items-center justify-center">
                  <Train className="h-4 w-4 text-secondary" />
                </div>
                <CardTitle className="text-base">Train Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trainNumber" className="flex items-center gap-1.5 text-xs">
                    <Hash className="h-3 w-3" /> Train Number
                  </Label>
                  <Input
                    id="trainNumber"
                    {...register('trainNumber')}
                    placeholder="e.g. 12952"
                    className={errors.trainNumber ? 'border-destructive' : ''}
                  />
                  {errors.trainNumber && <p className="text-xs text-destructive">{errors.trainNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainName" className="text-xs">Train Name</Label>
                  <Input
                    id="trainName"
                    {...register('trainName')}
                    placeholder="e.g. Mumbai Rajdhani"
                    className={errors.trainName ? 'border-destructive' : ''}
                  />
                  {errors.trainName && <p className="text-xs text-destructive">{errors.trainName.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Journey Details */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base">Journey Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">
                <div className="space-y-2">
                  <Label className="text-xs">From Station</Label>
                  <StationInput
                    value={fromStation ? `${fromStation}` : ''}
                    onSelect={handleFromSelect}
                    placeholder="Departure"
                    className={errors.fromStation ? 'border-destructive' : ''}
                  />
                  {errors.fromStation && <p className="text-xs text-destructive">Required</p>}
                </div>
                <div className="pt-7 text-muted-foreground">→</div>
                <div className="space-y-2">
                  <Label className="text-xs">To Station</Label>
                  <StationInput
                    value={toStation ? `${toStation}` : ''}
                    onSelect={handleToSelect}
                    placeholder="Destination"
                    className={errors.toStation ? 'border-destructive' : ''}
                  />
                  {errors.toStation && <p className="text-xs text-destructive">Required</p>}
                </div>
              </div>

              {/* Date, Class, Quota */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="journeyDate" className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" /> Date
                  </Label>
                  <Input
                    id="journeyDate"
                    type="date"
                    {...register('journeyDate')}
                    className={errors.journeyDate ? 'border-destructive' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Class</Label>
                  <Select onValueChange={(v) => setValue('travelClass', v as any)}>
                    <SelectTrigger className={errors.travelClass ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRAVEL_CLASSES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Quota</Label>
                  <Select onValueChange={(v) => setValue('quota', v as any)}>
                    <SelectTrigger className={errors.quota ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUOTAS.map((q) => (
                        <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PNR */}
              <div className="space-y-2">
                <Label htmlFor="pnr" className="text-xs">PNR Number</Label>
                <Input
                  id="pnr"
                  {...register('pnr')}
                  placeholder="10-digit PNR"
                  maxLength={10}
                  inputMode="numeric"
                  className={errors.pnr ? 'border-destructive' : ''}
                />
                {errors.pnr && <p className="text-xs text-destructive">{errors.pnr.message}</p>}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-1 text-xs">
                  <IndianRupee className="h-3 w-3" /> Asking Price (per passenger)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">₹</span>
                  <Input
                    id="price"
                    {...register('price')}
                    placeholder="e.g. 800"
                    className={`pl-7 ${errors.price ? 'border-destructive' : ''}`}
                    inputMode="numeric"
                  />
                </div>
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Passenger Details */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-green-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Passenger Details</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Each passenger creates a separate listing
                    </CardDescription>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ passengerName: '', passengerAge: undefined as any, passengerGender: 'M', seatNumber: '' })
                  }
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Passenger
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length > 1 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
                  <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <p>
                    You have <strong>{fields.length} passengers</strong>. This will create <strong>{fields.length} separate ticket listings</strong> — one per passenger.
                  </p>
                </div>
              )}

              {fields.map((field, index) => (
                <div key={field.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-muted-foreground">
                        Passenger {index + 1}
                      </p>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <Label className="text-xs">Full Name</Label>
                        <Input
                          {...register(`passengers.${index}.passengerName`)}
                          placeholder="As per ticket"
                          className={errors.passengers?.[index]?.passengerName ? 'border-destructive' : ''}
                        />
                        {errors.passengers?.[index]?.passengerName && (
                          <p className="text-xs text-destructive">Name required</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Age</Label>
                        <Input
                          {...register(`passengers.${index}.passengerAge`)}
                          type="number"
                          placeholder="Age"
                          min={1}
                          max={120}
                          className={errors.passengers?.[index]?.passengerAge ? 'border-destructive' : ''}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Gender</Label>
                        <Select
                          defaultValue="M"
                          onValueChange={(v) => setValue(`passengers.${index}.passengerGender`, v as 'M' | 'F' | 'T')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDERS.map((g) => (
                              <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Seat / Berth (optional)</Label>
                        <Input
                          {...register(`passengers.${index}.seatNumber`)}
                          placeholder="e.g. B2 45"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3 pb-8">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 text-base font-semibold">
              {loading
                ? 'Listing…'
                : fields.length > 1
                  ? `List ${fields.length} Tickets`
                  : 'List Ticket'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
