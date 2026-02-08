
export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  philosophy: string;
  achievements: string[];
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  colorClass: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  title: string;
  description: string;
  category: 'lesson' | 'leadership' | 'gallery';
  fileName?: string;
}

export interface SiteSettings {
  competitionName: string;
  year: string;
  region: string;
  contactEmail: string;
}

export interface SiteContent {
  profile: ProfileData;
  projects: Project[];
  media: MediaItem[];
  features: Feature[];
  heroImageUrl: string;
  introVideoUrl: string;
  settings: SiteSettings;
}

export type ViewMode = 'visitor' | 'admin';
