export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  birthDate: string | null;
  avatarUrl: string | null;
  memberSince: string;
}
