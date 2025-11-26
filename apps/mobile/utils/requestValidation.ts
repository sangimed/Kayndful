import { RequestDraft } from '../store/requests';

// Extension du type RequestDraft pour inclure tous les champs du formulaire
export type RequestFormData = RequestDraft & {
  category: string;
  estimatedMinutes: 30 | 45 | 60 | 90 | 120;
  maxVolunteers: number;
  availabilityStart?: string;
  availabilityEnd?: string;
  languages?: string[];
  constraints?: string[];
  requiredEquipment?: string[];
  urgency: 'Faible' | 'Modérée' | 'Élevée';
  thumbnailUri?: string;
  acceptedRules: boolean;
  published: boolean;
};

// Validateurs
const phoneRegex = /(\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}/;
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/;
const addressRegex = /\d+[\s,]+(?:rue|avenue|boulevard|allée|place|impasse|chemin)/i;

const profanityList = ['connard', 'salaud', 'putain', 'merde', 'chier']; // liste minimale

export function validateTitle(title: string): string | null {
  if (!title || title.trim().length < 3) {
    return 'Le titre doit contenir au moins 3 caractères.';
  }
  if (title.length > 80) {
    return 'Le titre ne peut pas dépasser 80 caractères.';
  }
  if (phoneRegex.test(title)) {
    return 'Le titre ne doit pas contenir de numéro de téléphone.';
  }
  if (emailRegex.test(title)) {
    return "Le titre ne doit pas contenir d'adresse email.";
  }
  if (urlRegex.test(title)) {
    return "Le titre ne doit pas contenir d'URL.";
  }
  if (addressRegex.test(title)) {
    return "Le titre ne doit pas contenir d'adresse complète.";
  }
  return null;
}

export function validateDescription(description: string): string | null {
  if (!description || description.trim().length < 50) {
    return 'La description doit contenir au moins 50 caractères.';
  }
  if (description.length > 1000) {
    return 'La description ne peut pas dépasser 1000 caractères.';
  }
  if (phoneRegex.test(description)) {
    return 'La description ne doit pas contenir de numéro de téléphone.';
  }
  if (emailRegex.test(description)) {
    return "La description ne doit pas contenir d'adresse email.";
  }
  if (urlRegex.test(description)) {
    return "La description ne doit pas contenir d'URL.";
  }
  if (addressRegex.test(description)) {
    return "La description ne doit pas contenir d'adresse complète.";
  }
  const lowerDesc = description.toLowerCase();
  for (const word of profanityList) {
    if (lowerDesc.includes(word)) {
      return 'La description contient du contenu inapproprié.';
    }
  }
  return null;
}

export function validateCategory(category?: string): string | null {
  const validCategories = [
    'Courses',
    'Aide à domicile',
    'Déplacements',
    'Informatique',
    'Administratif',
    'Autre',
  ];
  if (!category) {
    return 'Veuillez sélectionner une catégorie.';
  }
  if (!validCategories.includes(category)) {
    return 'Catégorie invalide.';
  }
  return null;
}

export function validateEstimatedMinutes(minutes?: number): string | null {
  const validMinutes = [30, 45, 60, 90, 120];
  if (!minutes) {
    return 'Veuillez sélectionner une durée estimée.';
  }
  if (!validMinutes.includes(minutes)) {
    return 'Durée invalide.';
  }
  return null;
}

export function validateMaxVolunteers(max?: number): string | null {
  if (!max || max < 1 || max > 5 || !Number.isInteger(max)) {
    return 'Le nombre de volontaires doit être entre 1 et 5.';
  }
  return null;
}

export function validateAvailability(start?: string, end?: string): string | null {
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate <= startDate) {
      return 'La fin de disponibilité doit être après le début.';
    }
  }
  return null;
}

export function validateAcceptedRules(accepted: boolean): string | null {
  if (!accepted) {
    return 'Vous devez accepter les règles de la communauté.';
  }
  return null;
}

export function validateForm(data: Partial<RequestFormData>): Record<string, string> {
  const errors: Record<string, string> = {};

  const titleError = validateTitle(data.title || '');
  if (titleError) errors.title = titleError;

  const descError = validateDescription(data.description || '');
  if (descError) errors.description = descError;

  const catError = validateCategory(data.category);
  if (catError) errors.category = catError;

  const minError = validateEstimatedMinutes(data.estimatedMinutes);
  if (minError) errors.estimatedMinutes = minError;

  const volError = validateMaxVolunteers(data.maxVolunteers);
  if (volError) errors.maxVolunteers = volError;

  const availError = validateAvailability(data.availabilityStart, data.availabilityEnd);
  if (availError) errors.availability = availError;

  const rulesError = validateAcceptedRules(data.acceptedRules || false);
  if (rulesError) errors.acceptedRules = rulesError;

  return errors;
}

export function formatDuration(minutes: number): string {
  if (minutes === 30) return '30 min';
  if (minutes === 45) return '45 min';
  if (minutes === 60) return '1 h';
  if (minutes === 90) return '1 h 30';
  if (minutes === 120) return '2 h';
  return `${minutes} min`;
}

export function generateDraftId(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
