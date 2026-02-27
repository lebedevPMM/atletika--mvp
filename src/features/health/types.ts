export interface VisitStats {
  totalVisits: number;
  thisMonth: number;
  lastMonth: number;
  avgPerWeek: number;
  streak: number; // current weekly streak
  byType: { type: string; count: number }[];
  monthly: { month: string; count: number }[]; // last 6 months
}

export interface Contraindication {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  addedAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'parent' | 'other';
  membershipStatus: 'active' | 'expired' | 'none';
  avatarUrl?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'certificate' | 'contract' | 'policy' | 'receipt' | 'medical';
  url: string;
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  type: 'trainer' | 'class';
  title: string;
  subtitle: string;
  rating?: number;
  avatarUrl?: string;
}
