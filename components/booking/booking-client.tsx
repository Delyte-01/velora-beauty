'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { services, timeSlots } from '@/data/services';
import { getServiceBySlug } from '@/data/services';
import { formatNGN } from '@/lib/format';
import { validateBooking, isPastDate, type BookingForm, type BookingErrors } from '@/lib/validation';
import { saveBooking, generateBookingReference } from '@/lib/bookings';
import type { Booking } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export function BookingClient() {
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get('service');

  const [form, setForm] = useState<BookingForm>({
    serviceId: '',
    date: '',
    timeSlot: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  useEffect(() => {
    if (preselectedSlug) {
      const svc = getServiceBySlug(preselectedSlug);
      if (svc) setForm((prev) => ({ ...prev, serviceId: svc.id }));
    }
  }, [preselectedSlug]);

  const today = new Date().toISOString().split('T')[0];
  const selectedService = useMemo(
    () => services.find((s) => s.id === form.serviceId),
    [form.serviceId]
  );

  function update<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateBooking(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!selectedService) return;

    setSubmitting(true);
    const booking: Booking = {
      reference: generateBookingReference(),
      createdAt: new Date().toISOString(),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: form.date,
      timeSlot: form.timeSlot,
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        notes: form.notes || undefined,
      },
      price: selectedService.price,
      status: 'Demo — Pending',
    };

    saveBooking(booking);
    setSubmitting(false);
    setConfirmed(booking);
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-5 font-heading text-3xl text-foreground">Booking Confirmed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you, {confirmed.customer.name.split(' ')[0]}. Your demo appointment has been saved.
          </p>
          <div className="mt-4 rounded-md bg-secondary px-4 py-2 text-sm">
            Booking reference: <span className="font-semibold text-foreground">{confirmed.reference}</span>
          </div>
          <p className="mt-4 max-w-md text-xs text-muted-foreground">
            This is a demonstration booking. It is not sent to a real salon, and availability
            is not synchronized across customers or devices.
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h2 className="font-heading text-lg text-foreground">Appointment Details</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p><span className="text-muted-foreground">Service:</span> {confirmed.serviceName}</p>
            <p><span className="text-muted-foreground">Price:</span> {formatNGN(confirmed.price)}</p>
            <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {confirmed.date}</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {confirmed.timeSlot}</p>
            <p><span className="text-muted-foreground">Phone:</span> {confirmed.customer.phone}</p>
            <p><span className="text-muted-foreground">Email:</span> {confirmed.customer.email}</p>
            {confirmed.customer.notes && (
              <p className="sm:col-span-2"><span className="text-muted-foreground">Notes:</span> {confirmed.customer.notes}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Browse more services
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Return home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Book an Appointment</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Choose a service, pick a time that works for you, and we will save your demo booking.
      </p>

      <div className="mt-6 rounded-md bg-secondary px-4 py-3 text-xs text-secondary-foreground">
        Demonstration booking only. No real appointment is reserved and availability is not
        synchronized.
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Service selection */}
        <fieldset className="rounded-lg border border-border bg-card p-6">
          <legend className="px-2 font-heading text-lg text-foreground">1. Choose a service</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {services.map((svc) => (
              <button
                key={svc.id}
                type="button"
                onClick={() => update('serviceId', svc.id)}
                className={cn(
                  'flex flex-col rounded-md border p-4 text-left transition-colors',
                  form.serviceId === svc.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-foreground">{svc.name}</span>
                  {form.serviceId === svc.id && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="mt-1 text-xs text-muted-foreground">{svc.duration} · {svc.category}</span>
                <span className="mt-2 text-sm font-semibold text-foreground">{formatNGN(svc.price)}</span>
              </button>
            ))}
          </div>
          {errors.serviceId && <p className="mt-2 text-xs text-destructive">{errors.serviceId}</p>}
        </fieldset>

        {/* Date & time */}
        <fieldset className="rounded-lg border border-border bg-card p-6">
          <legend className="px-2 font-heading text-lg text-foreground">2. Select date & time</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="mt-1.5"
                aria-invalid={!!errors.date}
              />
              {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date}</p>}
              {form.date && isPastDate(form.date) && (
                <p className="mt-1 text-xs text-destructive">Please choose a future date.</p>
              )}
            </div>
            <div>
              <Label htmlFor="time">Time slot *</Label>
              <Select value={form.timeSlot} onValueChange={(v) => update('timeSlot', v)}>
                <SelectTrigger id="time" className="mt-1.5"><SelectValue placeholder="Select a time" /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timeSlot && <p className="mt-1 text-xs text-destructive">{errors.timeSlot}</p>}
            </div>
          </div>
        </fieldset>

        {/* Contact details */}
        <fieldset className="rounded-lg border border-border bg-card p-6">
          <legend className="px-2 font-heading text-lg text-foreground">3. Your details</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="b-name">Full name *</Label>
              <Input
                id="b-name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="mt-1.5"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="b-phone">Phone number *</Label>
              <Input
                id="b-phone"
                type="tel"
                placeholder="0803 123 4567"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="mt-1.5"
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="b-email">Email address *</Label>
              <Input
                id="b-email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="mt-1.5"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="b-notes">Notes (optional)</Label>
              <Textarea
                id="b-notes"
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                className="mt-1.5"
                rows={3}
                placeholder="Any preferences or details for your specialist..."
              />
            </div>
          </div>
        </fieldset>

        {/* Review */}
        {selectedService && (
          <div className="rounded-lg border border-border bg-secondary p-6">
            <h2 className="font-heading text-lg text-foreground">Booking Summary</h2>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <p><span className="text-muted-foreground">Service:</span> {selectedService.name}</p>
              <p><span className="text-muted-foreground">Duration:</span> {selectedService.duration}</p>
              <p><span className="text-muted-foreground">Date:</span> {form.date || 'Not selected'}</p>
              <p><span className="text-muted-foreground">Time:</span> {form.timeSlot || 'Not selected'}</p>
              <p className="font-semibold sm:col-span-2">Price: {formatNGN(selectedService.price)}</p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full gap-2"
          size="lg"
        >
          {submitting ? 'Saving...' : (
            <>
              <Check className="h-4 w-4" /> Confirm demo booking
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
