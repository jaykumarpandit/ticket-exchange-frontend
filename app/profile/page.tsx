'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/navbar';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import api from '@/lib/api';
import type { User as UserType } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserType | null>(null);
  const [showToAll, setShowToAll] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api.get<UserType>('/users/me').then((res) => {
      setProfileData(res.data);
      setShowToAll(res.data.mobileVisible === 'anyone');
      reset({ name: res.data.name, mobile: res.data.mobile ?? '' });
    });
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.patch('/users/profile', {
        ...data,
        mobileVisible: showToAll ? 'anyone' : 'buyer',
      });
      toast({ title: 'Profile updated!' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster />
      <main className="container max-w-lg py-10">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-4 ring-primary/20">
                <AvatarImage src={session?.user?.image ?? ''} />
                <AvatarFallback className="bg-primary text-white text-lg font-bold">
                  {session?.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Edit Profile</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">{session?.user?.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
                </Label>
                <Input id="name" {...register('name')} placeholder="Your name" className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Mobile Number
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">+91</span>
                  <Input id="mobile" {...register('mobile')} placeholder="9876543210" className={`pl-12 ${errors.mobile ? 'border-destructive' : ''}`} maxLength={10} inputMode="numeric" />
                </div>
                {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/50 border border-border/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    {showToAll ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    <p className="text-sm font-medium">{showToAll ? 'Visible to everyone' : 'Hidden from listing'}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {showToAll ? 'Number shown on all ticket listings' : 'Number hidden from public listings'}
                  </p>
                </div>
                <Switch checked={showToAll} onCheckedChange={setShowToAll} />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
