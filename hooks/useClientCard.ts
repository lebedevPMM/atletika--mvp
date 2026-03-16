import { useState, useEffect, useCallback } from 'react';
import type {
  ClientCard,
  CardId,
  PurchasedService,
  UpcomingBooking,
  BodyMeasurement,
  TrainingPlan,
  VisitRecord,
  ClientNote,
  NoteAuthorRole,
} from '../types/client-card';
import {
  getClientCard,
  getPurchasedServices,
  getUpcomingBookings,
  getBodyMeasurements,
  getTrainingPlan,
  getVisitRecords,
  getClientNotes,
  addClientNote,
} from '../mocks/client-card-db';

/** Simulated network delay in milliseconds */
const SIMULATED_DELAY = 300;

/**
 * Generic async-data hook that wraps a synchronous mock-DB fetcher
 * in a setTimeout to simulate network latency.
 *
 * @typeParam T - The return type of the fetcher function
 * @param fetcher - Synchronous function that reads from the mock DB
 * @param deps - Dependency array that triggers a re-fetch when changed
 * @param enabled - When false the fetch is skipped entirely (lazy loading)
 */
function useAsyncData<T>(
  fetcher: () => T,
  deps: readonly unknown[],
  enabled: boolean = true,
): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    setLoading(true);
    const timer = setTimeout(() => {
      setData(fetcher());
      setLoading(false);
    }, SIMULATED_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled]);

  return { data, loading };
}

// ---------------------------------------------------------------------------
// Aggregate root -- loads immediately
// ---------------------------------------------------------------------------

/**
 * Loads the full ClientCard aggregate root.
 *
 * @param cardId - Branded card identifier
 * @returns `card` (or null while loading) and a `loading` flag
 */
export function useClientCard(cardId: CardId) {
  const { data: card, loading } = useAsyncData(
    () => getClientCard(cardId) ?? null,
    [cardId],
  );
  return { card, loading };
}

// ---------------------------------------------------------------------------
// Lazy sub-resources -- loaded on demand via `enabled` flag
// ---------------------------------------------------------------------------

/**
 * Purchased services (PT packs, group bundles, SPA passes, etc.)
 */
export function useClientPurchases(cardId: CardId, enabled: boolean = true) {
  const { data: purchases, loading } = useAsyncData(
    () => getPurchasedServices(cardId),
    [cardId],
    enabled,
  );
  return { purchases: purchases ?? [], loading };
}

/**
 * Upcoming bookings for the client.
 */
export function useClientBookings(cardId: CardId, enabled: boolean = true) {
  const { data: bookings, loading } = useAsyncData(
    () => getUpcomingBookings(cardId),
    [cardId],
    enabled,
  );
  return { bookings: bookings ?? [], loading };
}

/**
 * Body-measurement history (weight, chest, waist, hips).
 */
export function useClientMeasurements(cardId: CardId, enabled: boolean = true) {
  const { data: measurements, loading } = useAsyncData(
    () => getBodyMeasurements(cardId),
    [cardId],
    enabled,
  );
  return { measurements: measurements ?? [], loading };
}

/**
 * Active training plan (if any).
 */
export function useClientPlan(cardId: CardId, enabled: boolean = true) {
  const { data: plan, loading } = useAsyncData(
    () => getTrainingPlan(cardId) ?? null,
    [cardId],
    enabled,
  );
  return { plan, loading };
}

/**
 * Visit history records.
 */
export function useClientVisits(cardId: CardId, enabled: boolean = true) {
  const { data: visits, loading } = useAsyncData(
    () => getVisitRecords(cardId),
    [cardId],
    enabled,
  );
  return { visits: visits ?? [], loading };
}

// ---------------------------------------------------------------------------
// Notes -- read + write (mutation via addNote callback)
// ---------------------------------------------------------------------------

/**
 * Client notes with an optimistic `addNote` mutation.
 *
 * @param cardId - Branded card identifier
 * @param authorRole - Optional filter: show only notes from a specific role
 * @param enabled - Lazy-load gate
 */
export function useClientNotes(
  cardId: CardId,
  authorRole?: NoteAuthorRole,
  enabled: boolean = true,
) {
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    setLoading(true);
    const timer = setTimeout(() => {
      setNotes(getClientNotes(cardId, authorRole));
      setLoading(false);
    }, SIMULATED_DELAY);

    return () => clearTimeout(timer);
  }, [cardId, authorRole, enabled]);

  /**
   * Optimistically prepends a new note to the local list.
   * The note is also persisted to the mock DB so subsequent fetches
   * include it.
   */
  const addNote = useCallback(
    (
      text: string,
      authorId: string,
      role: NoteAuthorRole,
      authorName: string,
    ) => {
      const newNote = addClientNote({
        cardId,
        authorId,
        authorRole: role,
        authorName,
        text,
      });
      setNotes((prev) => [newNote, ...prev]);
    },
    [cardId],
  );

  return { notes, loading, addNote };
}
