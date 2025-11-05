import React, { createContext, useContext, useMemo, useReducer } from 'react';

export type NameVisibility = 'initial' | 'hidden';

export type IdentityData = {
  firstName: string;
  lastName: string;
  username: string; // required
  visibility: NameVisibility; // controls last name display
};

export type LocationData = {
  address?: string; // optional when zip/city provided
  zip?: string;
  city?: string;
  usedCurrentLocation?: boolean;
};

export type ProfileData = {
  avatarUri?: string;
  bio?: string;
};

export type SkillsData = {
  skills: string[];
  other?: string;
};

export type AvailabilityData = {
  times: ('mornings' | 'afternoons' | 'evenings' | 'weekends')[];
  radiusKm: 1 | 5 | 10 | 20;
  mode: 'in_person' | 'remote' | 'both';
};

export type OnboardingState = {
  identity: IdentityData;
  location: LocationData;
  profile: ProfileData;
  skills: SkillsData;
  availability: AvailabilityData;
};

type Action =
  | { type: 'identity/update'; payload: Partial<IdentityData> }
  | { type: 'location/update'; payload: Partial<LocationData> }
  | { type: 'profile/update'; payload: Partial<ProfileData> }
  | { type: 'skills/update'; payload: Partial<SkillsData> }
  | { type: 'availability/update'; payload: Partial<AvailabilityData> }
  | { type: 'reset' };

const initialState: OnboardingState = {
  identity: {
    firstName: '',
    lastName: '',
    username: '',
    visibility: 'initial',
  },
  location: {},
  profile: {},
  skills: { skills: [] },
  availability: { times: [], radiusKm: 5, mode: 'both' },
};

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case 'identity/update':
      return { ...state, identity: { ...state.identity, ...action.payload } };
    case 'location/update':
      return { ...state, location: { ...state.location, ...action.payload } };
    case 'profile/update':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'skills/update':
      return { ...state, skills: { ...state.skills, ...action.payload } };
    case 'availability/update':
      return { ...state, availability: { ...state.availability, ...action.payload } };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

type Ctx = {
  state: OnboardingState;
  dispatch: React.Dispatch<Action>;
};

const OnboardingContext = createContext<Ctx | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return React.createElement(OnboardingContext.Provider, { value }, children as any);
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

export function formatDisplayName(identity: IdentityData) {
  const f = identity.firstName?.trim();
  const l = identity.lastName?.trim();
  if (!f && !l) return '';
  if (identity.visibility === 'hidden') return f || '';
  const initial = l ? `${l.charAt(0).toUpperCase()}.` : '';
  return [f, initial].filter(Boolean).join(' ');
}
