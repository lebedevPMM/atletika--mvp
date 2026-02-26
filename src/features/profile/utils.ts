import type { UserProfile } from './types';

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatPhone(phone: string): string {
  // Already formatted in mock, just return
  return phone;
}

export function formatMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
}

export function formatBirthDate(iso: string | null): string {
  if (!iso) return 'Не указана';
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function isProfileComplete(profile: UserProfile): boolean {
  return !!(profile.email && profile.birthDate);
}
