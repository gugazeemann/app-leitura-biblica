// 📖 Luz da Palavra - Types

// ============================================
// USER & PROFILE
// ============================================

export type ReligiousTradition = 
  | 'evangelical'
  | 'catholic'
  | 'jewish'
  | 'spiritist'
  | 'believer'
  | 'other';

export type BibleFamiliarity = 
  | 'beginner'
  | 'intermediate'
  | 'frequent'
  | 'advanced';

export type UserGoal = 
  | 'continuous_study'
  | 'emotional_support'
  | 'relationship_with_god'
  | 'learn_faith'
  | 'spiritual_guidance'
  | 'other';

export type EmotionalState = 
  | 'anxious'
  | 'sad'
  | 'discouraged'
  | 'confused'
  | 'grateful'
  | 'peaceful'
  | 'seeking_answers'
  | 'prefer_not_say';

export type ReadingFrequency = 
  | 'daily'
  | 'few_times_week'
  | 'difficult_moments'
  | 'no_commitment';

export type BibleTranslation = 
  | 'ACF'
  | 'ARC'
  | 'KJV'
  | 'WEB';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  religiousTradition?: ReligiousTradition;
  bibleFamiliarity?: BibleFamiliarity;
  goals?: UserGoal[];
  emotionalState?: EmotionalState;
  readingFrequency?: ReadingFrequency;
  preferredTranslation: BibleTranslation;
  artisticMode: boolean;
  isPremium: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
  lastActiveAt: Date;
}

// ============================================
// BIBLE CONTENT
// ============================================

export interface Verse {
  id: string;
  book: string;
  bookNumber: number;
  chapter: number;
  verse: number;
  text: string;
  translation: BibleTranslation;
  tags: string[];
  emotionalTags?: EmotionalState[];
}

export interface VerseReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

export interface DailyVerse {
  id: string;
  date: Date;
  verse: Verse;
  reflection?: string;
  imageUrl?: string;
  isPastoral?: boolean;
  groupId?: string;
}

// ============================================
// STUDY PLANS
// ============================================

export type StudyPlanType = 
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'thematic'
  | 'chronological'
  | 'devotional';

export interface StudyPlan {
  id: string;
  name: string;
  description: string;
  type: StudyPlanType;
  totalDays: number;
  difficulty: BibleFamiliarity;
  verses: VerseReference[];
  isPremium: boolean;
}

export interface UserStudyProgress {
  id: string;
  userId: string;
  planId: string;
  currentDay: number;
  completedDays: number[];
  startedAt: Date;
  lastReadAt?: Date;
  completed: boolean;
}

// ============================================
// EMOTIONAL SUPPORT
// ============================================

export interface EmotionalSuggestion {
  id: string;
  emotion: EmotionalState;
  verse: Verse;
  message: string;
  priority: number;
}

export interface LightRequest {
  id: string;
  userId: string;
  emotion: EmotionalState;
  verseId: string;
  createdAt: Date;
  helpful?: boolean;
}

// ============================================
// INTERPRETATIONS
// ============================================

export interface UserInterpretation {
  id: string;
  userId: string;
  verseId: string;
  interpretation?: string;
  howItHelped?: string;
  createdAt: Date;
  isAnonymous: boolean;
}

// ============================================
// GAMIFICATION
// ============================================

export type GrowthLevel = 
  | 'seed'      // 0-100
  | 'root'      // 101-500
  | 'trunk'     // 501-1500
  | 'flower'    // 1501-3000
  | 'tree';     // 3001+

export type BadgeType = 
  | 'flame_alive'        // 7 dias consecutivos
  | 'morning_star'       // Leitura antes das 8h
  | 'scholar'            // 50 versículos
  | 'reflective'         // 20 interpretações
  | 'focused'            // Completou trilha
  | 'light_bearer';      // Ajudou 10 pessoas

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  isPremium: boolean;
}

export interface UserBadge {
  userId: string;
  badgeId: BadgeType;
  earnedAt: Date;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'special';
  requirement: {
    action: 'read_verses' | 'complete_study' | 'share_interpretation' | 'visit_light';
    count: number;
  };
  expiresAt?: Date;
}

export interface UserGamification {
  userId: string;
  totalPoints: number;
  level: GrowthLevel;
  currentStreak: number;
  longestStreak: number;
  versesRead: number;
  studiesCompleted: number;
  interpretationsShared: number;
  badges: BadgeType[];
  lastActivityDate: Date;
}

// ============================================
// PREMIUM FEATURES
// ============================================

export interface Group {
  id: string;
  name: string;
  description?: string;
  churchName?: string;
  pastorId: string;
  memberCount: number;
  createdAt: Date;
  isPremium: boolean;
}

export interface GroupMember {
  groupId: string;
  userId: string;
  role: 'pastor' | 'leader' | 'member';
  joinedAt: Date;
}

export interface PastoralContent {
  id: string;
  groupId: string;
  verseId: string;
  reflection: string;
  additionalContent?: string;
  date: Date;
  createdBy: string;
}

// ============================================
// NOTIFICATIONS
// ============================================

export type NotificationType = 
  | 'daily_verse'
  | 'study_reminder'
  | 'streak_reminder'
  | 'achievement'
  | 'group_message';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// ============================================
// APP STATE
// ============================================

export interface AppState {
  user: UserProfile | null;
  isLoading: boolean;
  currentVerse: Verse | null;
  dailyVerse: DailyVerse | null;
  currentStudyPlan: StudyPlan | null;
  studyProgress: UserStudyProgress | null;
  gamification: UserGamification | null;
  notifications: Notification[];
}

// ============================================
// ONBOARDING
// ============================================

export interface OnboardingStep {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
  }[];
  canSkip: boolean;
  field: keyof UserProfile;
}

export interface OnboardingData {
  religiousTradition?: ReligiousTradition;
  bibleFamiliarity?: BibleFamiliarity;
  goals?: UserGoal[];
  emotionalState?: EmotionalState;
  readingFrequency?: ReadingFrequency;
}
