import { create } from 'zustand';
import type { UpdateProfileInput, User } from '../services/mockApi';
import { getCurrentUserSnapshot, getUserById, updateUserProfile } from '../services/mockApi';

export type AuthState = {
  isAuthenticated: boolean;
  currentUser?: User;
  loginWithMock: () => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<User | undefined>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  currentUser: undefined,
  // TODO(dev): Temporary mocked login for local testing only. Replace when backend is ready.
  loginWithMock: () => {
    const snapshot = getCurrentUserSnapshot();
    set({ isAuthenticated: true, currentUser: snapshot });
  },
  logout: () => set({ isAuthenticated: false, currentUser: undefined }),
  refreshProfile: async () => {
    const currentId = get().currentUser?.id ?? 'me';
    const user = await getUserById(currentId);
    if (user) {
      set({ currentUser: user });
    }
  },
  updateProfile: async (input) => {
    const current = get().currentUser ?? getCurrentUserSnapshot();
    try {
      const updated = await updateUserProfile(current.id, input);
      set({ currentUser: updated });
      return updated;
    } catch (error) {
      return undefined;
    }
  },
}));
