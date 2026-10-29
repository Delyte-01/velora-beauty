export interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  instructions: string;
  deliveryMethod: string;
}

export interface CheckoutErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  state?: string;
  city?: string;
  address?: string;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nigerianPhoneRe = /^(\+?234|0)[789]\d{9}$/;

export function validateCheckout(form: CheckoutForm): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRe.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!nigerianPhoneRe.test(form.phone.replace(/\s|-/g, ''))) {
    errors.phone = 'Enter a valid Nigerian phone number (e.g. 0803 123 4567).';
  }
  if (!form.state) errors.state = 'Select a state.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.address.trim()) errors.address = 'Street address is required.';
  return errors;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export function validateContact(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {};
  if (!form.name.trim()) errors.name = 'Your name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRe.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!nigerianPhoneRe.test(form.phone.replace(/\s|-/g, ''))) {
    errors.phone = 'Enter a valid Nigerian phone number.';
  }
  if (!form.message.trim()) errors.message = 'Please enter a message.';
  return errors;
}

export interface BookingForm {
  serviceId: string;
  date: string;
  timeSlot: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface BookingErrors {
  serviceId?: string;
  date?: string;
  timeSlot?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export function validateBooking(form: BookingForm): BookingErrors {
  const errors: BookingErrors = {};
  if (!form.serviceId) errors.serviceId = 'Please choose a service.';
  if (!form.date) errors.date = 'Please select a date.';
  if (!form.timeSlot) errors.timeSlot = 'Please select a time slot.';
  if (!form.name.trim()) errors.name = 'Your name is required.';
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!nigerianPhoneRe.test(form.phone.replace(/\s|-/g, ''))) {
    errors.phone = 'Enter a valid Nigerian phone number.';
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRe.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  return errors;
}

export function isPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}
