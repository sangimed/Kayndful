import type { RequestInit } from 'node-fetch';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type ZoneOption = {
  id: string;
  label: string;
  radiusMeters: number;
};

export type Neighborhood = {
  id: string;
  name: string;
  description: string;
  center: Coordinates;
  options: ZoneOption[];
};

export type User = {
  id: string;
  name: string;
  bio?: string;
  skills: string[];
  area: string;
  avatar?: string;
};

export type RequestMedia = {
  id: string;
  type: 'image' | 'video';
  thumbnail: string;
  source: string;
  durationSeconds?: number;
};

export type RequestSupporter = {
  id: string;
  name: string;
  avatar?: string;
};

export type Request = {
  id: string;
  title: string;
  category: string;
  eta: number;
  area: string;
  description?: string;
  createdAt: string;
  author: { id: string; name: string; avatar?: string };
  coordinates: Coordinates;
  neighborhoodId: string;
  xp: number;
  distanceMeters: number;
  media?: RequestMedia[];
  supporters: RequestSupporter[];
  supportCount: number;
  tags: string[];
  isFollowed?: boolean;
  isCommunity?: boolean;
};

export type Message = {
  id: string;
  chatId: string;
  fromId: string;
  toId: string;
  body: string;
  createdAt: string;
};

export type ConversationSummary = {
  id: string;
  chatId: string;
  requestId: string;
  requestTitle: string;
  requestCategory?: string;
  peer: { id: string; name: string; avatar?: string };
  lastMessage: Message;
  unreadCount: number;
};

type GetRequestsParams = {
  page: number;
  pageSize?: number;
  filters?: {
    category?: string;
    maxEta?: number;
    area?: string;
    query?: string;
    neighborhoodId?: string;
    radiusMeters?: number;
    maxDistanceMeters?: number;
    minXp?: number;
    channel?: FeedChannel;
    sortBy?: RequestSortOption;
  };
};

type GetRequestsResult = {
  items: Request[];
  hasMore: boolean;
};

export type CreateRequestInput = {
  title: string;
  category: string;
  eta: number;
  area: string;
  description?: string;
  authorId: string;
  coordinates?: Coordinates;
  neighborhoodId?: string;
  xp?: number;
  distanceMeters?: number;
  media?: RequestMedia[];
  tags?: string[];
};

export type FeedChannel = 'latest' | 'community' | 'following';
export type RequestSortOption = 'recent' | 'distance' | 'xp';

export type UpdateProfileInput = {
  name?: string;
  bio?: string;
  skills?: string[];
  area?: string;
  avatar?: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockOfflineError extends Error {
  code = 'OFFLINE' as const;

  constructor(message = 'offline') {
    super(message);
    this.name = 'MockOfflineError';
  }
}

let mockOffline = false;

export function setMockOffline(flag: boolean) {
  mockOffline = flag;
}

export function isMockOffline() {
  return mockOffline;
}

const ensureOnline = () => {
  if (mockOffline) {
    throw new MockOfflineError();
  }
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'belleville',
    name: 'Belleville',
    description: 'Quartier anime et convivial',
    center: { lat: 48.8721, lng: 2.3824 },
    options: [
      { id: 'belleville-400', label: 'Rayon 400 m', radiusMeters: 400 },
      { id: 'belleville-600', label: 'Rayon 600 m', radiusMeters: 600 },
      { id: 'belleville-800', label: 'Rayon 800 m', radiusMeters: 800 },
    ],
  },
  {
    id: 'republique',
    name: 'Republique',
    description: 'Carrefour central, tres accessible',
    center: { lat: 48.8672, lng: 2.3631 },
    options: [
      { id: 'republique-400', label: 'Rayon 400 m', radiusMeters: 400 },
      { id: 'republique-600', label: 'Rayon 600 m', radiusMeters: 600 },
      { id: 'republique-800', label: 'Rayon 800 m', radiusMeters: 800 },
    ],
  },
  {
    id: 'oberkampf',
    name: 'Oberkampf',
    description: 'Rue animee, ambiance de quartier',
    center: { lat: 48.8642, lng: 2.3706 },
    options: [
      { id: 'oberkampf-400', label: 'Rayon 400 m', radiusMeters: 400 },
      { id: 'oberkampf-600', label: 'Rayon 600 m', radiusMeters: 600 },
      { id: 'oberkampf-800', label: 'Rayon 800 m', radiusMeters: 800 },
    ],
  },
];

const users: User[] = [
  {
    id: 'me',
    name: 'Alex Martin',
    bio: 'Toujours partant pour filer un coup de main dans le quartier.',
    skills: ['Bricolage', 'Courses', 'Conseil'],
    area: 'Belleville (~800 m)',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 'u1',
    name: 'Camille',
    bio: 'Fan de DIY et de bricolage.',
    skills: ['Bricolage'],
    area: 'Belleville (~800 m)',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'u2',
    name: 'Ali',
    skills: ['Courses', 'Livraison'],
    area: 'Canal Saint-Martin (~1 km)',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 'u3',
    name: 'Lina',
    skills: ['Conseil', 'Mentorat'],
    area: 'Republique (~1.2 km)',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 'u4',
    name: 'Max',
    skills: ['Services'],
    area: 'Jourdain (~700 m)',
    avatar: 'https://i.pravatar.cc/150?img=55',
  },
  {
    id: 'u5',
    name: 'Zoe',
    skills: ['Discussion'],
    area: 'Oberkampf (~1 km)',
    avatar: 'https://i.pravatar.cc/150?img=24',
  },
  {
    id: 'u6',
    name: 'Noah',
    skills: ['Services', 'Impression'],
    area: 'Couronnes (~600 m)',
    avatar: 'https://i.pravatar.cc/150?img=68',
  },
];

const usersById = () => Object.fromEntries(users.map((user) => [user.id, user] as const));

const authorSnapshot = (userId: string) => {
  const map = usersById();
  const user = map[userId];
  return user ? { id: user.id, name: user.name, avatar: user.avatar } : { id: userId, name: 'Membre' };
};

const neighborhoodIdForArea = (area: string) => {
  const lower = area.toLowerCase();
  const match = NEIGHBORHOODS.find((hood) => lower.includes(hood.name.toLowerCase()));
  return match?.id ?? NEIGHBORHOODS[0].id;
};

let requests: Request[] = [
  {
    id: 'r1',
    title: "Besoin d'une perceuse",
    category: 'Bricolage',
    eta: 30,
    area: 'Belleville (~800 m)',
    description: 'Juste deux trous a percer pour fixer une etagere.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    author: authorSnapshot('u1'),
    coordinates: { lat: 48.8728, lng: 2.3815 },
    neighborhoodId: 'belleville',
    xp: 45,
    distanceMeters: 800,
    media: [
      {
        id: 'r1-media-1',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1582719478350-4bafb00c99f3?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1582719478350-4bafb00c99f3?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    supporters: [authorSnapshot('u2'), authorSnapshot('u3'), authorSnapshot('u5')],
    supportCount: 18,
    tags: ['Perceuse', 'Installation', 'Bricolage'],
    isFollowed: true,
    isCommunity: true,
  },
  {
    id: 'r2',
    title: 'Courses rapides',
    category: 'Courses',
    eta: 20,
    area: 'Canal Saint-Martin (~1 km)',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    author: authorSnapshot('u2'),
    coordinates: { lat: 48.8725, lng: 2.3662 },
    neighborhoodId: 'republique',
    xp: 35,
    distanceMeters: 1000,
    media: [
      {
        id: 'r2-media-1',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'r2-media-2',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'r2-media-3',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1437750769465-301382cdf094?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1437750769465-301382cdf094?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    supporters: [authorSnapshot('u1'), authorSnapshot('u4'), authorSnapshot('u6')],
    supportCount: 42,
    tags: ['Courses', 'Courses express', 'Alimentation'],
    isFollowed: false,
    isCommunity: true,
  },
  {
    id: 'r3',
    title: 'Conseil CV',
    category: 'Conseil',
    eta: 45,
    area: 'Republique (~1.2 km)',
    description: 'Relecture rapide et astuces pour se demarquer.',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    author: authorSnapshot('u3'),
    coordinates: { lat: 48.8679, lng: 2.3621 },
    neighborhoodId: 'republique',
    xp: 60,
    distanceMeters: 1200,
    media: [
      {
        id: 'r3-media-1',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'r3-media-2',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    supporters: [authorSnapshot('u2'), authorSnapshot('u5')],
    supportCount: 27,
    tags: ['Relecture', 'CV', 'Conseils'],
    isFollowed: true,
    isCommunity: true,
  },
  {
    id: 'r4',
    title: 'Sortir le chien',
    category: 'Services',
    eta: 25,
    area: 'Jourdain (~700 m)',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    author: authorSnapshot('u4'),
    coordinates: { lat: 48.8751, lng: 2.3926 },
    neighborhoodId: 'belleville',
    xp: 40,
    distanceMeters: 700,
    media: [
      {
        id: 'r4-media-1',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80',
        source: 'https://videos.pexels.com/video-files/2874899/2874899-hd_1280_720_30fps.mp4',
        durationSeconds: 34,
      },
      {
        id: 'r4-media-2',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    supporters: [authorSnapshot('u1'), authorSnapshot('u6')],
    supportCount: 31,
    tags: ['Animaux', 'Promenade', 'Services'],
    isFollowed: false,
    isCommunity: false,
  },
  {
    id: 'r5',
    title: 'Cafe papote',
    category: 'Discussion',
    eta: 60,
    area: 'Oberkampf (~1 km)',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    author: authorSnapshot('u5'),
    coordinates: { lat: 48.8649, lng: 2.3714 },
    neighborhoodId: 'oberkampf',
    xp: 25,
    distanceMeters: 1000,
    media: [
      {
        id: 'r5-media-1',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    supporters: [authorSnapshot('u3'), authorSnapshot('u4')],
    supportCount: 12,
    tags: ['Social', 'Cafe', 'Rencontre'],
    isFollowed: true,
    isCommunity: true,
  },
  {
    id: 'r6',
    title: 'Impression de documents',
    category: 'Services',
    eta: 15,
    area: 'Couronnes (~600 m)',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    author: authorSnapshot('u6'),
    coordinates: { lat: 48.8687, lng: 2.377 },
    neighborhoodId: 'oberkampf',
    xp: 30,
    distanceMeters: 600,
    media: [
      {
        id: 'r6-media-1',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73e?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'r6-media-2',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'r6-media-3',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'r6-media-4',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2f?auto=format&fit=crop&w=600&q=80',
        source: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2f?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    supporters: [authorSnapshot('u2'), authorSnapshot('u5'), authorSnapshot('u1')],
    supportCount: 54,
    tags: ['Impression', 'Services', 'Urgent'],
    isFollowed: false,
    isCommunity: false,
  },
];

type Conversation = {
  id: string;
  chatId: string;
  requestId: string;
  participantIds: [string, string];
  unreadBy: Record<string, number>;
};

let messages: Message[] = [
  {
    id: 'm1',
    chatId: 'c1',
    fromId: 'u1',
    toId: 'me',
    body: 'Salut Alex ! Tu peux passer avec ta perceuse ?',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'm2',
    chatId: 'c1',
    fromId: 'me',
    toId: 'u1',
    body: 'Oui bien sur, je suis dispo vers 18h.',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'm3',
    chatId: 'c2',
    fromId: 'u2',
    toId: 'me',
    body: 'Salut, tu pourrais prendre du lait en revenant ?',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    id: 'm4',
    chatId: 'c2',
    fromId: 'me',
    toId: 'u2',
    body: 'Pas de souci, je passe au magasin ce soir.',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
  },
];

let conversations: Conversation[] = [
  {
    id: 'conv1',
    chatId: 'c1',
    requestId: 'r1',
    participantIds: ['me', 'u1'],
    unreadBy: { me: 0, u1: 1 },
  },
  {
    id: 'conv2',
    chatId: 'c2',
    requestId: 'r2',
    participantIds: ['me', 'u2'],
    unreadBy: { me: 0, u2: 0 },
  },
];

const sortByDateDesc = (a: { createdAt: string }, b: { createdAt: string }) =>
  +new Date(b.createdAt) - +new Date(a.createdAt);

const matchesNeighborhood = (request: Request, neighborhoodId?: string, radiusMeters?: number) => {
  if (!neighborhoodId) return true;
  const hood = NEIGHBORHOODS.find((item) => item.id === neighborhoodId);
  if (!hood) return true;
  const distance = distanceInMeters(hood.center, request.coordinates);
  const radius = radiusMeters ?? hood.options[hood.options.length - 1].radiusMeters;
  return distance <= radius;
};

const distanceInMeters = (a: Coordinates, b: Coordinates) => {
  const earthRadius = 6371000;
  const dLat = deg2rad(b.lat - a.lat);
  const dLon = deg2rad(b.lng - a.lng);
  const lat1 = deg2rad(a.lat);
  const lat2 = deg2rad(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return earthRadius * c;
};

const deg2rad = (deg: number) => (deg * Math.PI) / 180;

export async function getRequests(params: GetRequestsParams): Promise<GetRequestsResult> {
  const { page, pageSize = 10, filters } = params;
  await delay(250 + Math.random() * 250);
  ensureOnline();

  let data = [...requests].sort(sortByDateDesc);

  if (filters?.category) {
    data = data.filter((item) => item.category === filters.category);
  }
  if (typeof filters?.maxEta === 'number') {
    data = data.filter((item) => item.eta <= (filters.maxEta as number));
  }
  if (typeof filters?.maxDistanceMeters === 'number') {
    data = data.filter((item) => item.distanceMeters <= (filters.maxDistanceMeters as number));
  }
  if (typeof filters?.minXp === 'number') {
    data = data.filter((item) => item.xp >= (filters.minXp as number));
  }
  if (filters?.channel === 'community') {
    data = data.filter((item) => item.isCommunity);
  } else if (filters?.channel === 'following') {
    data = data.filter((item) => item.isFollowed);
  }
  if (filters?.area) {
    const query = filters.area.toLowerCase();
    data = data.filter((item) => item.area.toLowerCase().includes(query));
  }
  if (filters?.query) {
    const q = filters.query.trim().toLowerCase();
    if (q.length) {
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
  }
  if (filters?.neighborhoodId) {
    data = data.filter((item) => matchesNeighborhood(item, filters.neighborhoodId, filters.radiusMeters));
  }

  if (filters?.sortBy === 'distance') {
    data = [...data].sort((a, b) => {
      const delta = a.distanceMeters - b.distanceMeters;
      return delta === 0 ? sortByDateDesc(a, b) : delta;
    });
  } else if (filters?.sortBy === 'xp') {
    data = [...data].sort((a, b) => {
      const delta = b.xp - a.xp;
      return delta === 0 ? sortByDateDesc(a, b) : delta;
    });
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = data.slice(start, end);
  const hasMore = end < data.length;

  return { items, hasMore };
}

export type SearchParams = {
  query?: string;
  neighborhoodId?: string;
  radiusMeters?: number;
  category?: string;
  maxEta?: number;
  maxDistanceMeters?: number;
  minXp?: number;
  sortBy?: RequestSortOption;
  channel?: FeedChannel;
};

export async function searchRequests(params: SearchParams): Promise<Request[]> {
  await delay(200);
  ensureOnline();
  const { query, neighborhoodId, radiusMeters, category, maxEta, maxDistanceMeters, minXp, sortBy, channel } = params;
  const result = await getRequests({
    page: 1,
    pageSize: 100,
    filters: { query, neighborhoodId, radiusMeters, category, maxEta, maxDistanceMeters, minXp, sortBy, channel },
  });
  return result.items;
}

export async function getRequestsByIds(ids: string[]): Promise<Request[]> {
  await delay(120);
  ensureOnline();
  const unique = Array.from(new Set(ids));
  return unique
    .map((id) => requests.find((item) => item.id === id))
    .filter((item): item is Request => Boolean(item));
}

export async function getRequestById(id: string): Promise<Request | undefined> {
  await delay(200);
  ensureOnline();
  return requests.find((item) => item.id === id);
}

export async function getRequestConversationSummary(requestId: string): Promise<ConversationSummary | undefined> {
  await delay(150);
  ensureOnline();
  const map = usersById();
  const request = requests.find((item) => item.id === requestId);
  const conversation = conversations.find((conv) => conv.requestId === requestId && conv.participantIds.includes('me'));
  if (!conversation || !request) return undefined;
  const peerId = conversation.participantIds.find((id) => id !== 'me') ?? 'me';
  const peer = map[peerId] ?? { id: peerId, name: 'Voisin' };
  const chatMessages = messages
    .filter((msg) => msg.chatId === conversation.chatId)
    .sort(sortByDateDesc);
  const lastMessage = chatMessages[0];
  return {
    id: conversation.id,
    chatId: conversation.chatId,
    requestId: request.id,
    requestTitle: request.title,
    requestCategory: request.category,
    peer: { id: peer.id, name: peer.name, avatar: peer.avatar },
    lastMessage:
      lastMessage ?? {
        id: `placeholder-${conversation.chatId}`,
        chatId: conversation.chatId,
        fromId: peer.id,
        toId: 'me',
        body: 'Nouvelle conversation',
        createdAt: new Date().toISOString(),
      },
    unreadCount: conversation.unreadBy['me'] ?? 0,
  };
}

export async function getRequestMessages(requestId: string): Promise<Message[]> {
  await delay(120);
  ensureOnline();
  const conversation = conversations.find((conv) => conv.requestId === requestId);
  if (!conversation) return [];
  return messages
    .filter((msg) => msg.chatId === conversation.chatId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
}

export async function createRequest(input: CreateRequestInput): Promise<Request> {
  await delay(200);
  ensureOnline();
  const author = authorSnapshot(input.authorId);
  const neighborhoodId = input.neighborhoodId ?? neighborhoodIdForArea(input.area);
  const baseNeighborhood = NEIGHBORHOODS.find((hood) => hood.id === neighborhoodId) ?? NEIGHBORHOODS[0];
  const coordinates =
    input.coordinates ?? {
      lat: baseNeighborhood.center.lat + (Math.random() - 0.5) * 0.01,
      lng: baseNeighborhood.center.lng + (Math.random() - 0.5) * 0.01,
    };
  const distanceMeters =
    input.distanceMeters ?? Math.round(distanceInMeters(baseNeighborhood.center, coordinates));
  const defaultXp = 30 + Math.round(Math.random() * 30);
  const request: Request = {
    id: `r-${uid()}`,
    title: input.title.trim(),
    category: input.category,
    eta: input.eta,
    area: input.area.trim(),
    description: input.description?.trim(),
    createdAt: new Date().toISOString(),
    author,
    coordinates,
    neighborhoodId,
    xp: input.xp ?? defaultXp,
    distanceMeters,
    media: input.media,
    supporters: [],
    supportCount: 0,
    tags: input.tags?.length ? input.tags : [input.category],
    isFollowed: true,
    isCommunity: true,
  };
  requests = [request, ...requests];
  return request;
}

export async function getConversations(userId: string): Promise<ConversationSummary[]> {
  await delay(200);
  ensureOnline();
  const map = usersById();
  return conversations
    .filter((conv) => conv.participantIds.includes(userId))
    .map((conv) => {
      const peerId = conv.participantIds.find((id) => id !== userId) ?? userId;
      const peer = map[peerId] ?? { id: peerId, name: 'Membre' };
      const request = requests.find((item) => item.id === conv.requestId);
      const chatMessages = messages
        .filter((msg) => msg.chatId === conv.chatId)
        .sort(sortByDateDesc);
      const lastMessage = chatMessages[0];
      return {
        id: conv.id,
        chatId: conv.chatId,
        requestId: conv.requestId,
        requestTitle: request?.title ?? 'Demande',
        requestCategory: request?.category,
        peer: { id: peer.id, name: peer.name, avatar: peer.avatar },
        lastMessage:
          lastMessage ?? {
            id: `placeholder-${conv.id}`,
            chatId: conv.chatId,
            fromId: peer.id,
            toId: userId,
            body: 'Nouvelle conversation',
            createdAt: new Date().toISOString(),
          },
        unreadCount: conv.unreadBy[userId] ?? 0,
      } satisfies ConversationSummary;
    })
    .sort((a, b) => sortByDateDesc(a.lastMessage, b.lastMessage));
}

export async function getMessages(chatId: string): Promise<Message[]> {
  await delay(150);
  ensureOnline();
  return messages
    .filter((msg) => msg.chatId === chatId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
}

export async function sendMessage(input: {
  chatId: string;
  fromId: string;
  toId: string;
  body: string;
}): Promise<Message> {
  await delay(120);
  ensureOnline();
  const message: Message = {
    id: `m-${uid()}`,
    chatId: input.chatId,
    fromId: input.fromId,
    toId: input.toId,
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
  };
  messages = [...messages, message];

  conversations = conversations.map((conv) => {
    if (conv.chatId !== input.chatId) return conv;
    return {
      ...conv,
      unreadBy: {
        ...conv.unreadBy,
        [input.fromId]: 0,
        [input.toId]: (conv.unreadBy[input.toId] ?? 0) + 1,
      },
    };
  });

  return message;
}

export async function markConversationAsRead(chatId: string, userId: string) {
  await delay(80);
  ensureOnline();
  conversations = conversations.map((conv) =>
    conv.chatId === chatId
      ? { ...conv, unreadBy: { ...conv.unreadBy, [userId]: 0 } }
      : conv
  );
}

export async function getUserById(id: string): Promise<User | undefined> {
  await delay(120);
  ensureOnline();
  return users.find((user) => user.id === id);
}

export async function updateUserProfile(
  id: string,
  input: UpdateProfileInput
): Promise<User> {
  await delay(150);
  ensureOnline();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    throw new Error('Utilisateur introuvable');
  }
  const updated: User = {
    ...users[index],
    ...input,
    skills: input.skills ?? users[index].skills,
  };
  users[index] = updated;

  requests = requests.map((req) =>
    req.author.id === id ? { ...req, author: authorSnapshot(id) } : req
  );

  return updated;
}

export async function getAllCategories(): Promise<string[]> {
  await delay(60);
  ensureOnline();
  const categories = Array.from(new Set(requests.map((req) => req.category)));
  categories.sort();
  return categories;
}

export function seedMockConversationWithRequest(requestId: string, participantId: string) {
  if (mockOffline) {
    throw new MockOfflineError();
  }
  const existing = conversations.find((conv) => conv.requestId === requestId);
  if (existing) return existing;
  const chatId = `c-${uid()}`;
  const conv: Conversation = {
    id: `conv-${uid()}`,
    chatId,
    requestId,
    participantIds: ['me', participantId],
    unreadBy: { me: 0, [participantId]: 0 },
  };
  conversations = [conv, ...conversations];
  return conv;
}

export function getCurrentUserSnapshot(): User {
  const current = users.find((user) => user.id === 'me');
  if (!current) {
    throw new Error('Mock current user missing');
  }
  return current;
}
