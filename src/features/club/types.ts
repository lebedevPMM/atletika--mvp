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
