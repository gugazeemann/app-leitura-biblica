// 📖 Luz da Palavra - Constants

import { 
  OnboardingStep, 
  Badge, 
  Mission,
  EmotionalState,
  GrowthLevel 
} from './types';

// ============================================
// APP CONFIG
// ============================================

export const APP_NAME = 'Luz da Palavra';
export const APP_DESCRIPTION = 'Seu companheiro espiritual diário';
export const APP_VERSION = '1.0.0';

// ============================================
// COLORS
// ============================================

export const COLORS = {
  primary: {
    light: '#8B9FE8',
    main: '#6B7FD7',
    dark: '#4B5FC7',
  },
  secondary: {
    light: '#81C784',
    main: '#66BB6A',
    dark: '#4CAF50',
  },
  accent: {
    light: '#FFD54F',
    main: '#FFC107',
    dark: '#FFA000',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  emotional: {
    anxious: '#FF9800',
    sad: '#2196F3',
    discouraged: '#9E9E9E',
    confused: '#9C27B0',
    grateful: '#4CAF50',
    peaceful: '#00BCD4',
    seeking: '#FFC107',
  }
};

// ============================================
// ONBOARDING STEPS
// ============================================

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    question: 'Oi, que bom ter você aqui. Quero te ajudar na sua caminhada espiritual. Posso te fazer algumas perguntas para deixar tudo mais personalizado?',
    options: [
      { value: 'yes', label: 'Claro' },
      { value: 'skip', label: 'Pular' },
    ],
    canSkip: true,
    field: 'onboardingCompleted',
  },
  {
    id: 2,
    question: 'Cada pessoa vive a espiritualidade de um jeito único. Com qual tradição você mais se identifica?',
    options: [
      { value: 'evangelical', label: 'Evangélico' },
      { value: 'catholic', label: 'Católico' },
      { value: 'jewish', label: 'Judeu / judaico-messiânico' },
      { value: 'spiritist', label: 'Espírita (kardecista)' },
      { value: 'believer', label: 'Sem religião, mas acredita em Deus' },
      { value: 'skip', label: 'Quero pular' },
    ],
    canSkip: true,
    field: 'religiousTradition',
  },
  {
    id: 3,
    question: 'Como você se sente ao ler a Bíblia?',
    options: [
      { value: 'beginner', label: 'Iniciante' },
      { value: 'intermediate', label: 'Já tive contato' },
      { value: 'frequent', label: 'Leio com frequência' },
      { value: 'advanced', label: 'Avançado / Estudioso' },
    ],
    canSkip: false,
    field: 'bibleFamiliarity',
  },
  {
    id: 4,
    question: 'O que te trouxe até aqui?',
    options: [
      { value: 'continuous_study', label: 'Estudo contínuo' },
      { value: 'emotional_support', label: 'Encontrar paz / ajuda emocional' },
      { value: 'relationship_with_god', label: 'Melhorar meu relacionamento com Deus' },
      { value: 'learn_faith', label: 'Aprender sobre fé' },
      { value: 'spiritual_guidance', label: 'Receber orientação espiritual' },
      { value: 'other', label: 'Outros' },
      { value: 'skip', label: 'Pular' },
    ],
    canSkip: true,
    field: 'goals',
  },
  {
    id: 5,
    question: 'Como você está se sentindo hoje?',
    options: [
      { value: 'anxious', label: 'Ansioso' },
      { value: 'sad', label: 'Triste' },
      { value: 'discouraged', label: 'Desanimado' },
      { value: 'confused', label: 'Confuso' },
      { value: 'grateful', label: 'Agradecido' },
      { value: 'peaceful', label: 'Em paz' },
      { value: 'seeking_answers', label: 'Em busca de respostas' },
      { value: 'prefer_not_say', label: 'Prefiro não dizer' },
    ],
    canSkip: true,
    field: 'emotionalState',
  },
  {
    id: 6,
    question: 'Com que frequência você gostaria de caminhar comigo?',
    options: [
      { value: 'daily', label: 'Diariamente' },
      { value: 'few_times_week', label: 'Algumas vezes por semana' },
      { value: 'difficult_moments', label: 'Nos momentos difíceis' },
      { value: 'no_commitment', label: 'Sem compromisso, por enquanto' },
    ],
    canSkip: false,
    field: 'readingFrequency',
  },
];

// ============================================
// EMOTIONAL MESSAGES
// ============================================

export const EMOTIONAL_MESSAGES: Record<EmotionalState, string[]> = {
  anxious: [
    'Entendo que você está se sentindo ansioso. Vamos encontrar uma palavra de paz juntos?',
    'A ansiedade pode ser pesada. Que tal buscarmos conforto na palavra?',
    'Respire fundo. Vamos encontrar uma mensagem que acalme seu coração.',
  ],
  sad: [
    'Sinto muito que você esteja triste. Estou aqui com você.',
    'A tristeza faz parte da vida. Vamos buscar conforto juntos?',
    'Você não está sozinho nessa. Vamos encontrar uma palavra de esperança.',
  ],
  discouraged: [
    'Sei que às vezes é difícil continuar. Vamos encontrar força juntos?',
    'O desânimo pode passar. Que tal uma palavra de encorajamento?',
    'Você é mais forte do que imagina. Vamos buscar renovação?',
  ],
  confused: [
    'A confusão pode ser difícil. Vamos buscar clareza juntos?',
    'Quando tudo parece incerto, a palavra pode nos guiar.',
    'Vamos encontrar uma direção para o seu coração?',
  ],
  grateful: [
    'Que lindo ver gratidão no seu coração! Vamos celebrar juntos?',
    'A gratidão é uma bênção. Vamos fortalecer esse sentimento?',
    'Seu coração agradecido é inspirador. Vamos continuar assim?',
  ],
  peaceful: [
    'Que paz maravilhosa! Vamos manter esse sentimento?',
    'A paz interior é preciosa. Vamos nutri-la com a palavra?',
    'Seu coração em paz é lindo de ver. Vamos continuar nesse caminho?',
  ],
  seeking_answers: [
    'Buscar respostas é sábio. Vamos procurar juntos?',
    'As respostas virão no tempo certo. Vamos caminhar juntos?',
    'A busca por entendimento é nobre. Vamos explorar a palavra?',
  ],
  prefer_not_say: [
    'Tudo bem, respeito seu momento. Estou aqui quando precisar.',
    'Sem problemas. Vamos apenas buscar uma palavra reconfortante?',
    'Entendo. Que tal uma mensagem suave para o seu dia?',
  ],
};

// ============================================
// GAMIFICATION
// ============================================

export const GROWTH_LEVELS: Record<GrowthLevel, {
  name: string;
  description: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
}> = {
  seed: {
    name: 'Semente',
    description: 'Iniciando a jornada',
    minPoints: 0,
    maxPoints: 100,
    icon: '🌱',
  },
  root: {
    name: 'Raiz',
    description: 'Criando fundamentos',
    minPoints: 101,
    maxPoints: 500,
    icon: '🌿',
  },
  trunk: {
    name: 'Tronco',
    description: 'Fortalecendo a fé',
    minPoints: 501,
    maxPoints: 1500,
    icon: '🌳',
  },
  flower: {
    name: 'Flor',
    description: 'Florescendo espiritualmente',
    minPoints: 1501,
    maxPoints: 3000,
    icon: '🌸',
  },
  tree: {
    name: 'Árvore',
    description: 'Maduro na palavra',
    minPoints: 3001,
    maxPoints: Infinity,
    icon: '🌲',
  },
};

export const BADGES: Badge[] = [
  {
    id: 'flame_alive',
    name: 'Chama Acesa',
    description: '7 dias consecutivos de leitura',
    icon: '🔥',
    requirement: 7,
    isPremium: false,
  },
  {
    id: 'morning_star',
    name: 'Estrela da Manhã',
    description: 'Leitura antes das 8h',
    icon: '⭐',
    requirement: 1,
    isPremium: false,
  },
  {
    id: 'scholar',
    name: 'Estudioso',
    description: '50 versículos lidos',
    icon: '📚',
    requirement: 50,
    isPremium: false,
  },
  {
    id: 'reflective',
    name: 'Reflexivo',
    description: '20 interpretações compartilhadas',
    icon: '💬',
    requirement: 20,
    isPremium: false,
  },
  {
    id: 'focused',
    name: 'Focado',
    description: 'Completou uma trilha de estudo',
    icon: '🎯',
    requirement: 1,
    isPremium: false,
  },
  {
    id: 'light_bearer',
    name: 'Portador de Luz',
    description: 'Ajudou 10 pessoas indiretamente',
    icon: '🌟',
    requirement: 10,
    isPremium: true,
  },
];

export const POINTS_SYSTEM = {
  readVerse: 10,
  completeStudy: 25,
  shareInterpretation: 15,
  dailyStreak: 5,
  completeMission: 50,
  completeTrail: 100,
};

export const DAILY_MISSIONS: Mission[] = [
  {
    id: 'read_2_verses',
    title: 'Leia 2 versículos hoje',
    description: 'Continue sua jornada de leitura',
    points: 20,
    type: 'daily',
    requirement: {
      action: 'read_verses',
      count: 2,
    },
  },
  {
    id: 'morning_reading',
    title: 'Leitura matinal',
    description: 'Complete sua leitura antes do almoço',
    points: 15,
    type: 'daily',
    requirement: {
      action: 'read_verses',
      count: 1,
    },
  },
  {
    id: 'share_interpretation',
    title: 'Compartilhe uma reflexão',
    description: 'Escreva como um versículo te tocou',
    points: 25,
    type: 'daily',
    requirement: {
      action: 'share_interpretation',
      count: 1,
    },
  },
  {
    id: 'visit_light',
    title: 'Busque uma luz',
    description: 'Visite "Quero uma Luz" hoje',
    points: 10,
    type: 'daily',
    requirement: {
      action: 'visit_light',
      count: 1,
    },
  },
];

// ============================================
// BIBLE BOOKS
// ============================================

export const BOOKS = [
  { id: 'genesis', name: 'Gênesis', chapters: 50 },
  { id: 'exodus', name: 'Êxodo', chapters: 40 },
  { id: 'leviticus', name: 'Levítico', chapters: 27 },
  { id: 'numbers', name: 'Números', chapters: 36 },
  { id: 'deuteronomy', name: 'Deuteronômio', chapters: 34 },
  { id: 'joshua', name: 'Josué', chapters: 24 },
  { id: 'judges', name: 'Juízes', chapters: 21 },
  { id: 'ruth', name: 'Rute', chapters: 4 },
  { id: '1samuel', name: '1 Samuel', chapters: 31 },
  { id: '2samuel', name: '2 Samuel', chapters: 24 },
  { id: '1kings', name: '1 Reis', chapters: 22 },
  { id: '2kings', name: '2 Reis', chapters: 25 },
  { id: '1chronicles', name: '1 Crônicas', chapters: 29 },
  { id: '2chronicles', name: '2 Crônicas', chapters: 36 },
  { id: 'ezra', name: 'Esdras', chapters: 10 },
  { id: 'nehemiah', name: 'Neemias', chapters: 13 },
  { id: 'esther', name: 'Ester', chapters: 10 },
  { id: 'job', name: 'Jó', chapters: 42 },
  { id: 'psalms', name: 'Salmos', chapters: 150 },
  { id: 'proverbs', name: 'Provérbios', chapters: 31 },
  { id: 'ecclesiastes', name: 'Eclesiastes', chapters: 12 },
  { id: 'songofsolomon', name: 'Cânticos', chapters: 8 },
  { id: 'isaiah', name: 'Isaías', chapters: 66 },
  { id: 'jeremiah', name: 'Jeremias', chapters: 52 },
  { id: 'lamentations', name: 'Lamentações', chapters: 5 },
  { id: 'ezekiel', name: 'Ezequiel', chapters: 48 },
  { id: 'daniel', name: 'Daniel', chapters: 12 },
  { id: 'hosea', name: 'Oséias', chapters: 14 },
  { id: 'joel', name: 'Joel', chapters: 3 },
  { id: 'amos', name: 'Amós', chapters: 9 },
  { id: 'obadiah', name: 'Obadias', chapters: 1 },
  { id: 'jonah', name: 'Jonas', chapters: 4 },
  { id: 'micah', name: 'Miquéias', chapters: 7 },
  { id: 'nahum', name: 'Naum', chapters: 3 },
  { id: 'habakkuk', name: 'Habacuque', chapters: 3 },
  { id: 'zephaniah', name: 'Sofonias', chapters: 3 },
  { id: 'haggai', name: 'Ageu', chapters: 2 },
  { id: 'zechariah', name: 'Zacarias', chapters: 14 },
  { id: 'malachi', name: 'Malaquias', chapters: 4 },
  { id: 'matthew', name: 'Mateus', chapters: 28 },
  { id: 'mark', name: 'Marcos', chapters: 16 },
  { id: 'luke', name: 'Lucas', chapters: 24 },
  { id: 'john', name: 'João', chapters: 21 },
  { id: 'acts', name: 'Atos', chapters: 28 },
  { id: 'romans', name: 'Romanos', chapters: 16 },
  { id: '1corinthians', name: '1 Coríntios', chapters: 16 },
  { id: '2corinthians', name: '2 Coríntios', chapters: 13 },
  { id: 'galatians', name: 'Gálatas', chapters: 6 },
  { id: 'ephesians', name: 'Efésios', chapters: 6 },
  { id: 'philippians', name: 'Filipenses', chapters: 4 },
  { id: 'colossians', name: 'Colossenses', chapters: 4 },
  { id: '1thessalonians', name: '1 Tessalonicenses', chapters: 5 },
  { id: '2thessalonians', name: '2 Tessalonicenses', chapters: 3 },
  { id: '1timothy', name: '1 Timóteo', chapters: 6 },
  { id: '2timothy', name: '2 Timóteo', chapters: 4 },
  { id: 'titus', name: 'Tito', chapters: 3 },
  { id: 'philemon', name: 'Filemom', chapters: 1 },
  { id: 'hebrews', name: 'Hebreus', chapters: 13 },
  { id: 'james', name: 'Tiago', chapters: 5 },
  { id: '1peter', name: '1 Pedro', chapters: 5 },
  { id: '2peter', name: '2 Pedro', chapters: 3 },
  { id: '1john', name: '1 João', chapters: 5 },
  { id: '2john', name: '2 João', chapters: 1 },
  { id: '3john', name: '3 João', chapters: 1 },
  { id: 'jude', name: 'Judas', chapters: 1 },
  { id: 'revelation', name: 'Apocalipse', chapters: 22 },
];

export const KEYWORDS = [
  'amor', 'paz', 'fé', 'esperança', 'alegria', 'perdão', 'salvação',
  'graça', 'misericórdia', 'justiça', 'sabedoria', 'força', 'coragem',
  'confiança', 'oração', 'adoração', 'louvor', 'gratidão', 'humildade',
  'paciência', 'bondade', 'mansidão', 'domínio próprio', 'santidade',
  'verdade', 'vida eterna', 'reino de Deus', 'espírito santo',
];

export const BIBLE_BOOKS = [
  // Antigo Testamento
  { number: 1, name: 'Gênesis', abbr: 'Gn', testament: 'old' },
  { number: 2, name: 'Êxodo', abbr: 'Ex', testament: 'old' },
  { number: 3, name: 'Levítico', abbr: 'Lv', testament: 'old' },
  { number: 4, name: 'Números', abbr: 'Nm', testament: 'old' },
  { number: 5, name: 'Deuteronômio', abbr: 'Dt', testament: 'old' },
  { number: 6, name: 'Josué', abbr: 'Js', testament: 'old' },
  { number: 7, name: 'Juízes', abbr: 'Jz', testament: 'old' },
  { number: 8, name: 'Rute', abbr: 'Rt', testament: 'old' },
  { number: 9, name: '1 Samuel', abbr: '1Sm', testament: 'old' },
  { number: 10, name: '2 Samuel', abbr: '2Sm', testament: 'old' },
  { number: 11, name: '1 Reis', abbr: '1Rs', testament: 'old' },
  { number: 12, name: '2 Reis', abbr: '2Rs', testament: 'old' },
  { number: 13, name: '1 Crônicas', abbr: '1Cr', testament: 'old' },
  { number: 14, name: '2 Crônicas', abbr: '2Cr', testament: 'old' },
  { number: 15, name: 'Esdras', abbr: 'Ed', testament: 'old' },
  { number: 16, name: 'Neemias', abbr: 'Ne', testament: 'old' },
  { number: 17, name: 'Ester', abbr: 'Et', testament: 'old' },
  { number: 18, name: 'Jó', abbr: 'Jó', testament: 'old' },
  { number: 19, name: 'Salmos', abbr: 'Sl', testament: 'old' },
  { number: 20, name: 'Provérbios', abbr: 'Pv', testament: 'old' },
  { number: 21, name: 'Eclesiastes', abbr: 'Ec', testament: 'old' },
  { number: 22, name: 'Cânticos', abbr: 'Ct', testament: 'old' },
  { number: 23, name: 'Isaías', abbr: 'Is', testament: 'old' },
  { number: 24, name: 'Jeremias', abbr: 'Jr', testament: 'old' },
  { number: 25, name: 'Lamentações', abbr: 'Lm', testament: 'old' },
  { number: 26, name: 'Ezequiel', abbr: 'Ez', testament: 'old' },
  { number: 27, name: 'Daniel', abbr: 'Dn', testament: 'old' },
  { number: 28, name: 'Oséias', abbr: 'Os', testament: 'old' },
  { number: 29, name: 'Joel', abbr: 'Jl', testament: 'old' },
  { number: 30, name: 'Amós', abbr: 'Am', testament: 'old' },
  { number: 31, name: 'Obadias', abbr: 'Ob', testament: 'old' },
  { number: 32, name: 'Jonas', abbr: 'Jn', testament: 'old' },
  { number: 33, name: 'Miquéias', abbr: 'Mq', testament: 'old' },
  { number: 34, name: 'Naum', abbr: 'Na', testament: 'old' },
  { number: 35, name: 'Habacuque', abbr: 'Hc', testament: 'old' },
  { number: 36, name: 'Sofonias', abbr: 'Sf', testament: 'old' },
  { number: 37, name: 'Ageu', abbr: 'Ag', testament: 'old' },
  { number: 38, name: 'Zacarias', abbr: 'Zc', testament: 'old' },
  { number: 39, name: 'Malaquias', abbr: 'Ml', testament: 'old' },
  
  // Novo Testamento
  { number: 40, name: 'Mateus', abbr: 'Mt', testament: 'new' },
  { number: 41, name: 'Marcos', abbr: 'Mc', testament: 'new' },
  { number: 42, name: 'Lucas', abbr: 'Lc', testament: 'new' },
  { number: 43, name: 'João', abbr: 'Jo', testament: 'new' },
  { number: 44, name: 'Atos', abbr: 'At', testament: 'new' },
  { number: 45, name: 'Romanos', abbr: 'Rm', testament: 'new' },
  { number: 46, name: '1 Coríntios', abbr: '1Co', testament: 'new' },
  { number: 47, name: '2 Coríntios', abbr: '2Co', testament: 'new' },
  { number: 48, name: 'Gálatas', abbr: 'Gl', testament: 'new' },
  { number: 49, name: 'Efésios', abbr: 'Ef', testament: 'new' },
  { number: 50, name: 'Filipenses', abbr: 'Fp', testament: 'new' },
  { number: 51, name: 'Colossenses', abbr: 'Cl', testament: 'new' },
  { number: 52, name: '1 Tessalonicenses', abbr: '1Ts', testament: 'new' },
  { number: 53, name: '2 Tessalonicenses', abbr: '2Ts', testament: 'new' },
  { number: 54, name: '1 Timóteo', abbr: '1Tm', testament: 'new' },
  { number: 55, name: '2 Timóteo', abbr: '2Tm', testament: 'new' },
  { number: 56, name: 'Tito', abbr: 'Tt', testament: 'new' },
  { number: 57, name: 'Filemom', abbr: 'Fm', testament: 'new' },
  { number: 58, name: 'Hebreus', abbr: 'Hb', testament: 'new' },
  { number: 59, name: 'Tiago', abbr: 'Tg', testament: 'new' },
  { number: 60, name: '1 Pedro', abbr: '1Pe', testament: 'new' },
  { number: 61, name: '2 Pedro', abbr: '2Pe', testament: 'new' },
  { number: 62, name: '1 João', abbr: '1Jo', testament: 'new' },
  { number: 63, name: '2 João', abbr: '2Jo', testament: 'new' },
  { number: 64, name: '3 João', abbr: '3Jo', testament: 'new' },
  { number: 65, name: 'Judas', abbr: 'Jd', testament: 'new' },
  { number: 66, name: 'Apocalipse', abbr: 'Ap', testament: 'new' },
];

// ============================================
// PREMIUM FEATURES
// ============================================

export const PREMIUM_FEATURES = [
  {
    title: 'Zero anúncios',
    description: 'Experiência sem interrupções',
    icon: '🚫',
  },
  {
    title: 'Modo artístico',
    description: 'Ilustrações inspiradoras para cada versículo',
    icon: '🎨',
  },
  {
    title: 'Sugestões ilimitadas',
    description: 'Quantas luzes você precisar',
    icon: '💡',
  },
  {
    title: 'Leitura offline',
    description: 'Acesse mesmo sem internet',
    icon: '📱',
  },
  {
    title: 'Sincronização',
    description: 'Continue de onde parou em qualquer dispositivo',
    icon: '🔄',
  },
  {
    title: 'Comunidades',
    description: 'Conecte-se com seu grupo de fé',
    icon: '👥',
  },
  {
    title: 'Trilhas avançadas',
    description: 'Estudos teológicos profundos',
    icon: '📚',
  },
  {
    title: 'Estatísticas',
    description: 'Acompanhe seu crescimento espiritual',
    icon: '📊',
  },
];

export const PREMIUM_PRICE = {
  monthly: 9.90,
  yearly: 89.90,
  yearlyMonthly: 7.49, // 89.90 / 12
};
