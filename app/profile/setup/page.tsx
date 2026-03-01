'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Train, Phone, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import api from '@/lib/api';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  mobileVisible: z.enum(['anyone', 'buyer']),
});

type FormData = z.infer<typeof schema>;

export default function ProfileSetupPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showToAll, setShowToAll] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: session?.user?.name ?? '',
      mobile: '',
      mobileVisible: 'anyone',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.patch('/users/profile', {
        ...data,
        mobileVisible: showToAll ? 'anyone' : 'buyer',
      });

      // Update NextAuth session so `session.user.isProfileComplete` matches the DB
      await update({
        ...(session ?? {}),
        user: {
          ...(session?.user ?? {}),
          isProfileComplete: true,
        },
      });
      toast({ title: 'Profile saved!', description: 'Welcome to RailSwap.' });
      router.push('/');
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err?.response?.data?.message ?? 'Could not save profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-border/50 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-orange-400 to-secondary" />
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Train className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl">Complete your profile</CardTitle>
            <CardDescription>
              Just a few details to get started. Your mobile number lets buyers contact you.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Avatar preview */}
            <div className="flex justify-center mb-6">
              <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                <AvatarImage src={session?.user?.image ?? ''} />
                <AvatarFallback className="bg-primary text-white text-xl font-bold">
                  {session?.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Your name"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                    +91
                  </span>
                  <Input
                    id="mobile"
                    {...register('mobile')}
                    placeholder="9876543210"
                    className={`pl-12 ${errors.mobile ? 'border-destructive' : ''}`}
                    maxLength={10}
                    inputMode="numeric"
                  />
                </div>
                {errors.mobile && (
                  <p className="text-xs text-destructive">{errors.mobile.message}</p>
                )}
              </div>

              {/* Mobile visibility */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/50 border border-border/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    {showToAll ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <p className="text-sm font-medium">
                      {showToAll ? 'Visible to everyone' : 'Hidden from listing'}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {showToAll
                      ? 'Your mobile number will be shown on ticket listings'
                      : 'Buyers cannot see your number directly on listings'}
                  </p>
                </div>
                <Switch
                  checked={showToAll}
                  onCheckedChange={setShowToAll}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Saving…' : 'Save & Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
