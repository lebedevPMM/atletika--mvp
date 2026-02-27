export interface Club {
  id: string;
  name: string;
  address: string;
  logoUrl?: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  name: string;
  address: string;
}

export interface ClubConfig {
  spaEnabled: boolean;
  eventsEnabled: boolean;
  chatEnabled: boolean;
  freezeEnabled: boolean;
  cancelPolicyMinutes: number;
  maxBookingsPerDay: number;
}

// === S8 additions ===

export interface ClubDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  description: string;
  features: string[];
  socialLinks: { type: 'telegram' | 'whatsapp' | 'vk' | 'instagram'; url: string }[];
  coordinates?: { lat: number; lng: number };
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'trainer' | 'instructor' | 'spa' | 'manager';
  specialization: string;
  avatarUrl?: string;
  rating: number;
  experience: string;
  bio?: string;
  certifications?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  body: string;
  imageUrl?: string;
  category: 'news' | 'promo' | 'event';
  publishedAt: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'trainer' | 'system';
  text: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'booking' | 'promo' | 'system' | 'chat';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
