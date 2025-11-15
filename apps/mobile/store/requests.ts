import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type RequestDraft = {
  id: string;
  title: string;
  category?: string;
  eta?: number;
  area?: string;
  description?: string;
  neighborhoodId?: string;
  radiusMeters?: number;
  updatedAt: string;
  // Nouveaux champs pour le formulaire complet
  estimatedMinutes?: number;
  maxVolunteers?: number;
  availabilityStart?: string;
  availabilityEnd?: string;
  languages?: string[];
  constraints?: string[];
  requiredEquipment?: string[];
  urgency?: string;
  thumbnailUri?: string;
  acceptedRules?: boolean;
  published?: boolean;
};

type RequestStore = {
  bookmarks: string[];
  drafts: Record<string, RequestDraft>;
  toggleBookmark: (requestId: string) => void;
  isBookmarked: (requestId: string) => boolean;
  saveDraft: (draft: RequestDraft) => void;
  deleteDraft: (draftId: string) => void;
  clearDrafts: () => void;
};

export const useRequestStore = create<RequestStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      drafts: {},
      toggleBookmark: (requestId) => {
        set((state) => {
          const exists = state.bookmarks.includes(requestId);
          return {
            bookmarks: exists
              ? state.bookmarks.filter((id) => id !== requestId)
              : [...state.bookmarks, requestId],
          };
        });
      },
      isBookmarked: (requestId) => get().bookmarks.includes(requestId),
      saveDraft: (draft) => {
        set((state) => ({
          drafts: {
            ...state.drafts,
            [draft.id]: {
              ...draft,
              updatedAt: draft.updatedAt ?? new Date().toISOString(),
            },
          },
        }));
      },
      deleteDraft: (draftId) => {
        set((state) => {
          const next = { ...state.drafts };
          delete next[draftId];
          return { drafts: next };
        });
      },
      clearDrafts: () => set({ drafts: {} }),
    }),
    {
      name: 'kayndful-request-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        drafts: state.drafts,
      }),
    },
  ),
);
