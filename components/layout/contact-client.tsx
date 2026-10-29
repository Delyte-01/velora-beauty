'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Check, Send } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { validateContact, type ContactForm, type ContactErrors } from '@/lib/validation';
import { whatsappLink } from '@/lib/whatsapp';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';

const emptyForm: ContactForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export function ContactClient() {
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);

  function update<K extends keyof ContactForm>(key: K, value: ContactForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateContact(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSent(true);
    setForm(emptyForm);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Get in touch</p>
        <h1 className="mt-3 font-heading text-3xl text-foreground sm:text-4xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Have a question about a product or service? We are happy to help.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-6">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                  <Check className="h-7 w-7 text-primary" />
                </div>
                <h2 className="mt-4 font-heading text-xl text-foreground">Message received</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Thank you for reaching out. This is a demo form — your message was not
                  sent to a real inbox, but a real store would reply here.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="c-name">Your name *</Label>
                    <Input
                      id="c-name"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className="mt-1.5"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="c-phone">Phone number *</Label>
                    <Input
                      id="c-phone"
                      type="tel"
                      placeholder="0803 123 4567"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="mt-1.5"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="c-email">Email address *</Label>
                  <Input
                    id="c-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="mt-1.5"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="c-message">Message *</Label>
                  <Textarea
                    id="c-message"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    className="mt-1.5"
                    rows={5}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                </div>
                <Button type="submit" className="gap-2" size="lg">
                  <Send className="h-4 w-4" /> Send message
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-heading text-lg text-foreground">Reach Us Directly</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{siteConfig.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <a href={`mailto:${siteConfig.email}`} className="text-muted-foreground transition-colors hover:text-primary">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-primary" />
                <a href={`tel:${siteConfig.phone}`} className="text-muted-foreground transition-colors hover:text-primary">
                  {siteConfig.phone}
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <WhatsAppButton
                message={`Hello ${siteConfig.name}, I have a question.`}
                label="Ask on WhatsApp"
                variant="solid"
                className="w-full"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-secondary p-6">
            <h2 className="font-heading text-base text-foreground">Business Hours</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex justify-between"><span>Mon – Fri</span><span>9:00 – 18:00</span></li>
              <li className="flex justify-between"><span>Saturday</span><span>10:00 – 17:00</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
