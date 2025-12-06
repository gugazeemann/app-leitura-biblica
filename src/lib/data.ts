// 📖 Luz da Palavra - Sample Data

import { Verse, EmotionalState } from './types';

// ============================================
// SAMPLE VERSES (Domínio Público - ACF)
// ============================================

export const SAMPLE_VERSES: Verse[] = [
  // ANSIEDADE
  {
    id: 'php-4-6-7',
    book: 'Filipenses',
    bookNumber: 50,
    chapter: 4,
    verse: 6,
    text: 'Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças.',
    translation: 'ACF',
    tags: ['ansiedade', 'paz', 'oração'],
    emotionalTags: ['anxious'],
  },
  {
    id: 'mt-6-34',
    book: 'Mateus',
    bookNumber: 40,
    chapter: 6,
    verse: 34,
    text: 'Não vos inquieteis, pois, pelo dia de amanhã, porque o dia de amanhã cuidará de si mesmo. Basta a cada dia o seu mal.',
    translation: 'ACF',
    tags: ['ansiedade', 'confiança', 'presente'],
    emotionalTags: ['anxious'],
  },
  {
    id: '1pe-5-7',
    book: '1 Pedro',
    bookNumber: 60,
    chapter: 5,
    verse: 7,
    text: 'Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.',
    translation: 'ACF',
    tags: ['ansiedade', 'cuidado', 'confiança'],
    emotionalTags: ['anxious'],
  },

  // TRISTEZA
  {
    id: 'sl-34-18',
    book: 'Salmos',
    bookNumber: 19,
    chapter: 34,
    verse: 18,
    text: 'Perto está o Senhor dos que têm o coração quebrantado, e salva os contritos de espírito.',
    translation: 'ACF',
    tags: ['tristeza', 'conforto', 'presença'],
    emotionalTags: ['sad'],
  },
  {
    id: 'jo-16-33',
    book: 'João',
    bookNumber: 43,
    chapter: 16,
    verse: 33,
    text: 'Tenho-vos dito isto, para que em mim tenhais paz; no mundo tereis aflições, mas tende bom ânimo, eu venci o mundo.',
    translation: 'ACF',
    tags: ['tristeza', 'paz', 'vitória'],
    emotionalTags: ['sad', 'discouraged'],
  },
  {
    id: '2co-1-3-4',
    book: '2 Coríntios',
    bookNumber: 47,
    chapter: 1,
    verse: 3,
    text: 'Bendito seja o Deus e Pai de nosso Senhor Jesus Cristo, o Pai das misericórdias e o Deus de toda a consolação.',
    translation: 'ACF',
    tags: ['tristeza', 'consolação', 'misericórdia'],
    emotionalTags: ['sad'],
  },

  // DESÂNIMO
  {
    id: 'is-41-10',
    book: 'Isaías',
    bookNumber: 23,
    chapter: 41,
    verse: 10,
    text: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.',
    translation: 'ACF',
    tags: ['desânimo', 'força', 'coragem'],
    emotionalTags: ['discouraged', 'anxious'],
  },
  {
    id: 'js-1-9',
    book: 'Josué',
    bookNumber: 6,
    chapter: 1,
    verse: 9,
    text: 'Não to mandei eu? Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.',
    translation: 'ACF',
    tags: ['desânimo', 'coragem', 'presença'],
    emotionalTags: ['discouraged', 'anxious'],
  },
  {
    id: 'sl-27-1',
    book: 'Salmos',
    bookNumber: 19,
    chapter: 27,
    verse: 1,
    text: 'O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?',
    translation: 'ACF',
    tags: ['desânimo', 'força', 'luz'],
    emotionalTags: ['discouraged', 'seeking_answers'],
  },

  // CONFUSÃO
  {
    id: 'pv-3-5-6',
    book: 'Provérbios',
    bookNumber: 20,
    chapter: 3,
    verse: 5,
    text: 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.',
    translation: 'ACF',
    tags: ['confusão', 'confiança', 'direção'],
    emotionalTags: ['confused', 'seeking_answers'],
  },
  {
    id: 'tg-1-5',
    book: 'Tiago',
    bookNumber: 59,
    chapter: 1,
    verse: 5,
    text: 'E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente, e o não lança em rosto, e ser-lhe-á dada.',
    translation: 'ACF',
    tags: ['confusão', 'sabedoria', 'oração'],
    emotionalTags: ['confused', 'seeking_answers'],
  },
  {
    id: 'sl-32-8',
    book: 'Salmos',
    bookNumber: 19,
    chapter: 32,
    verse: 8,
    text: 'Instruir-te-ei, e ensinar-te-ei o caminho que deves seguir; guiar-te-ei com os meus olhos.',
    translation: 'ACF',
    tags: ['confusão', 'direção', 'ensino'],
    emotionalTags: ['confused', 'seeking_answers'],
  },

  // GRATIDÃO
  {
    id: 'sl-100-4',
    book: 'Salmos',
    bookNumber: 19,
    chapter: 100,
    verse: 4,
    text: 'Entrai pelas portas dele com gratidão, e em seus átrios com louvor; louvai-o, e bendizei o seu nome.',
    translation: 'ACF',
    tags: ['gratidão', 'louvor', 'adoração'],
    emotionalTags: ['grateful', 'peaceful'],
  },
  {
    id: '1ts-5-18',
    book: '1 Tessalonicenses',
    bookNumber: 52,
    chapter: 5,
    verse: 18,
    text: 'Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.',
    translation: 'ACF',
    tags: ['gratidão', 'vontade', 'alegria'],
    emotionalTags: ['grateful'],
  },
  {
    id: 'cl-3-17',
    book: 'Colossenses',
    bookNumber: 51,
    chapter: 3,
    verse: 17,
    text: 'E, quanto fizerdes por palavras ou por obras, fazei tudo em nome do Senhor Jesus, dando por ele graças a Deus Pai.',
    translation: 'ACF',
    tags: ['gratidão', 'ação', 'nome'],
    emotionalTags: ['grateful'],
  },

  // PAZ
  {
    id: 'jo-14-27',
    book: 'João',
    bookNumber: 43,
    chapter: 14,
    verse: 27,
    text: 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.',
    translation: 'ACF',
    tags: ['paz', 'conforto', 'coração'],
    emotionalTags: ['peaceful', 'anxious'],
  },
  {
    id: 'rm-15-13',
    book: 'Romanos',
    bookNumber: 45,
    chapter: 15,
    verse: 13,
    text: 'Ora o Deus de esperança vos encha de todo o gozo e paz em crença, para que abundeis em esperança pela virtude do Espírito Santo.',
    translation: 'ACF',
    tags: ['paz', 'esperança', 'alegria'],
    emotionalTags: ['peaceful', 'grateful'],
  },
  {
    id: 'sl-4-8',
    book: 'Salmos',
    bookNumber: 19,
    chapter: 4,
    verse: 8,
    text: 'Em paz também me deitarei e dormirei, porque só tu, Senhor, me fazes descansar seguro.',
    translation: 'ACF',
    tags: ['paz', 'descanso', 'segurança'],
    emotionalTags: ['peaceful', 'anxious'],
  },

  // BUSCA DE RESPOSTAS
  {
    id: 'jr-29-13',
    book: 'Jeremias',
    bookNumber: 24,
    chapter: 29,
    verse: 13,
    text: 'E buscar-me-eis, e me achareis, quando me buscardes com todo o vosso coração.',
    translation: 'ACF',
    tags: ['busca', 'encontro', 'coração'],
    emotionalTags: ['seeking_answers', 'confused'],
  },
  {
    id: 'mt-7-7',
    book: 'Mateus',
    bookNumber: 40,
    chapter: 7,
    verse: 7,
    text: 'Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.',
    translation: 'ACF',
    tags: ['busca', 'oração', 'resposta'],
    emotionalTags: ['seeking_answers'],
  },
  {
    id: 'sl-119-105',
    book: 'Salmos',
    bookNumber: 19,
    chapter: 119,
    verse: 105,
    text: 'Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.',
    translation: 'ACF',
    tags: ['busca', 'direção', 'luz'],
    emotionalTags: ['seeking_answers', 'confused'],
  },

  // VERSÍCULOS GERAIS (para estudo)
  {
    id: 'jo-3-16',
    book: 'João',
    bookNumber: 43,
    chapter: 3,
    verse: 16,
    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
    translation: 'ACF',
    tags: ['amor', 'salvação', 'fé'],
    emotionalTags: ['grateful', 'peaceful'],
  },
  {
    id: 'sl-23-1',
    book: 'Salmos',
    bookNumber: 19,
    chapter: 23,
    verse: 1,
    text: 'O Senhor é o meu pastor; nada me faltará.',
    translation: 'ACF',
    tags: ['cuidado', 'provisão', 'confiança'],
    emotionalTags: ['peaceful', 'grateful'],
  },
  {
    id: 'fp-4-13',
    book: 'Filipenses',
    bookNumber: 50,
    chapter: 4,
    verse: 13,
    text: 'Posso todas as coisas em Cristo que me fortalece.',
    translation: 'ACF',
    tags: ['força', 'capacidade', 'cristo'],
    emotionalTags: ['discouraged', 'seeking_answers'],
  },
  {
    id: 'rm-8-28',
    book: 'Romanos',
    bookNumber: 45,
    chapter: 8,
    verse: 28,
    text: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
    translation: 'ACF',
    tags: ['propósito', 'bem', 'amor'],
    emotionalTags: ['confused', 'seeking_answers'],
  },
];

// ============================================
// EMOTIONAL MAPPING
// ============================================

export const EMOTIONAL_VERSE_MAP: Record<EmotionalState, string[]> = {
  anxious: [
    'php-4-6-7',
    'mt-6-34',
    '1pe-5-7',
    'is-41-10',
    'jo-14-27',
    'sl-4-8',
  ],
  sad: [
    'sl-34-18',
    'jo-16-33',
    '2co-1-3-4',
    'sl-23-1',
  ],
  discouraged: [
    'is-41-10',
    'js-1-9',
    'sl-27-1',
    'fp-4-13',
    'jo-16-33',
  ],
  confused: [
    'pv-3-5-6',
    'tg-1-5',
    'sl-32-8',
    'jr-29-13',
    'sl-119-105',
    'rm-8-28',
  ],
  grateful: [
    'sl-100-4',
    '1ts-5-18',
    'cl-3-17',
    'jo-3-16',
    'sl-23-1',
  ],
  peaceful: [
    'jo-14-27',
    'rm-15-13',
    'sl-4-8',
    'sl-23-1',
    'jo-3-16',
  ],
  seeking_answers: [
    'jr-29-13',
    'mt-7-7',
    'sl-119-105',
    'pv-3-5-6',
    'tg-1-5',
    'rm-8-28',
  ],
  prefer_not_say: [
    'sl-23-1',
    'jo-3-16',
    'jo-14-27',
    'sl-100-4',
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getVerseById(id: string): Verse | undefined {
  return SAMPLE_VERSES.find(v => v.id === id);
}

export function getVersesByEmotion(emotion: EmotionalState): Verse[] {
  const verseIds = EMOTIONAL_VERSE_MAP[emotion] || [];
  return verseIds
    .map(id => getVerseById(id))
    .filter((v): v is Verse => v !== undefined);
}

export function getRandomVerseByEmotion(emotion: EmotionalState): Verse | undefined {
  const verses = getVersesByEmotion(emotion);
  if (verses.length === 0) return undefined;
  return verses[Math.floor(Math.random() * verses.length)];
}

export function getDailyVerse(): Verse {
  // Usa a data como seed para sempre retornar o mesmo versículo no mesmo dia
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % SAMPLE_VERSES.length;
  return SAMPLE_VERSES[index];
}

export function formatVerseReference(verse: Verse): string {
  return `${verse.book} ${verse.chapter}:${verse.verse}`;
}
