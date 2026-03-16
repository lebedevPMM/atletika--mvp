import type {
  ClientCard, CardId, ClientId, ClubId, TrainerId, PlanId,
  PurchasedService, UpcomingBooking, BodyMeasurement,
  TrainingPlan, VisitRecord, ClientNote
} from '../types/client-card';
import { seedClients, seedPurchases, seedBookings, seedMeasurements, seedPlans, seedVisits, seedNotes } from './seeds/clients';

// In-memory "tables"
export const clientCards: ClientCard[] = [...seedClients];
export const purchasedServices: PurchasedService[] = [...seedPurchases];
export const upcomingBookings: UpcomingBooking[] = [...seedBookings];
export const bodyMeasurements: BodyMeasurement[] = [...seedMeasurements];
export const trainingPlans: TrainingPlan[] = [...seedPlans];
export const visitRecords: VisitRecord[] = [...seedVisits];
export const clientNotes: ClientNote[] = [...seedNotes];

// Query functions
export function getClientCard(cardId: CardId): ClientCard | undefined {
  return clientCards.find(c => c.id === cardId);
}

export function getClientCardByClientId(clientId: ClientId, clubId: ClubId): ClientCard | undefined {
  return clientCards.find(c => c.clientId === clientId && c.clubId === clubId);
}

export function getPurchasedServices(cardId: CardId): PurchasedService[] {
  // For mock, return services for the first client
  return purchasedServices;
}

export function getUpcomingBookings(cardId: CardId): UpcomingBooking[] {
  return upcomingBookings;
}

export function getBodyMeasurements(cardId: CardId): BodyMeasurement[] {
  return bodyMeasurements;
}

export function getTrainingPlan(cardId: CardId): TrainingPlan | undefined {
  return trainingPlans[0];
}

export function getVisitRecords(cardId: CardId): VisitRecord[] {
  return visitRecords;
}

export function getClientNotes(cardId: CardId, authorRole?: 'trainer' | 'methodist'): ClientNote[] {
  let notes = clientNotes.filter(n => n.cardId === cardId);
  if (authorRole) notes = notes.filter(n => n.authorRole === authorRole);
  return notes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addClientNote(note: Omit<ClientNote, 'id' | 'createdAt'>): ClientNote {
  const newNote: ClientNote = {
    ...note,
    id: `note-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  clientNotes.push(newNote);
  return newNote;
}
