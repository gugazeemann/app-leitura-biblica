'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, ChevronLeft, ChevronRight, Home, Share2, Heart } from 'lucide-react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Book {
  id: string; // slug do livro
  name: string;
  chapters: number;
  testament: 'old' | 'new';
}

interface Verse {
  id: number;
  book_id: string; // slug do livro
  chapter_number: number;
  verse_number: number;
  text: string;
}

interface Navigation {
  previous: { book: string; chapter: number; verse: number } | null;
  next: { book: string; chapter: number; verse: number } | null;
}

export default function VersePage() {
  const params = useParams();
  const router = useRouter();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [navigation, setNavigation] = useState<Navigation>({ previous: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const bookSlug = params.book as string;
  const chapterNum = parseInt(params.chapter as string);
  const verseNum = parseInt(params.verse as string);

  useEffect(() => {
    loadVerse();
  }, [bookSlug, chapterNum, verseNum]);

  const loadVerse = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured() || !supabase) {
        setError('Supabase não está configurado.');
        setLoading(false);
        return;
      }

      // Carregar informações do livro (id é o slug)
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookSlug)
        .single();

      if (bookError || !bookData) {
        setError('Livro não encontrado.');
        setLoading(false);
        return;
      }

      setBook(bookData);

      // Carregar versículo atual
      const { data: verseData, error: verseError } = await supabase
        .from('verses')
        .select('*')
        .eq('book_id', bookData.id)
        .eq('chapter_number', chapterNum)
        .eq('verse_number', verseNum)
        .single();

      if (verseError || !verseData) {
        setError('Versículo não encontrado.');
        setLoading(false);
        return;
      }

      setVerse(verseData);

      // Calcular navegação (versículo anterior e próximo)
      await calculateNavigation(bookData, verseData);

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar versículo');
      setLoading(false);
    }
  };

  const calculateNavigation = async (currentBook: Book, currentVerse: Verse) => {
    if (!supabase) return;

    // Buscar versículo anterior
    let previousVerse = null;
    
    // Tentar versículo anterior no mesmo capítulo
    const { data: prevInChapter } = await supabase
      .from('verses')
      .select('*')
      .eq('book_id', currentBook.id)
      .eq('chapter_number', currentVerse.chapter_number)
      .lt('verse_number', currentVerse.verse_number)
      .order('verse_number', { ascending: false })
      .limit(1)
      .single();

    if (prevInChapter) {
      previousVerse = {
        book: currentBook.id,
        chapter: prevInChapter.chapter_number,
        verse: prevInChapter.verse_number
      };
    } else {
      // Tentar último versículo do capítulo anterior
      const { data: prevChapter } = await supabase
        .from('verses')
        .select('*')
        .eq('book_id', currentBook.id)
        .lt('chapter_number', currentVerse.chapter_number)
        .order('chapter_number', { ascending: false })
        .order('verse_number', { ascending: false })
        .limit(1)
        .single();

      if (prevChapter) {
        previousVerse = {
          book: currentBook.id,
          chapter: prevChapter.chapter_number,
          verse: prevChapter.verse_number
        };
      } else {
        // Tentar último versículo do livro anterior
        const { data: prevBook } = await supabase
          .from('books')
          .select('*')
          .lt('id', currentBook.id)
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (prevBook) {
          const { data: lastVerse } = await supabase
            .from('verses')
            .select('*')
            .eq('book_id', prevBook.id)
            .order('chapter_number', { ascending: false })
            .order('verse_number', { ascending: false })
            .limit(1)
            .single();

          if (lastVerse) {
            previousVerse = {
              book: prevBook.id,
              chapter: lastVerse.chapter_number,
              verse: lastVerse.verse_number
            };
          }
        }
      }
    }

    // Buscar próximo versículo
    let nextVerse = null;

    // Tentar próximo versículo no mesmo capítulo
    const { data: nextInChapter } = await supabase
      .from('verses')
      .select('*')
      .eq('book_id', currentBook.id)
      .eq('chapter_number', currentVerse.chapter_number)
      .gt('verse_number', currentVerse.verse_number)
      .order('verse_number', { ascending: true })
      .limit(1)
      .single();

    if (nextInChapter) {
      nextVerse = {
        book: currentBook.id,
        chapter: nextInChapter.chapter_number,
        verse: nextInChapter.verse_number
      };
    } else {
      // Tentar primeiro versículo do próximo capítulo
      const { data: nextChapter } = await supabase
        .from('verses')
        .select('*')
        .eq('book_id', currentBook.id)
        .gt('chapter_number', currentVerse.chapter_number)
        .order('chapter_number', { ascending: true })
        .order('verse_number', { ascending: true })
        .limit(1)
        .single();

      if (nextChapter) {
        nextVerse = {
          book: currentBook.id,
          chapter: nextChapter.chapter_number,
          verse: nextChapter.verse_number
        };
      } else {
        // Tentar primeiro versículo do próximo livro
        const { data: nextBook } = await supabase
          .from('books')
          .select('*')
          .gt('id', currentBook.id)
          .order('id', { ascending: true })
          .limit(1)
          .single();

        if (nextBook) {
          const { data: firstVerse } = await supabase
            .from('verses')
            .select('*')
            .eq('book_id', nextBook.id)
            .order('chapter_number', { ascending: true })
            .order('verse_number', { ascending: true })
            .limit(1)
            .single();

          if (firstVerse) {
            nextVerse = {
              book: nextBook.id,
              chapter: firstVerse.chapter_number,
              verse: firstVerse.verse_number
            };
          }
        }
      }
    }

    setNavigation({ previous: previousVerse, next: nextVerse });
  };

  const handleShare = async () => {
    const text = `${book?.name} ${chapterNum}:${verseNum}\n\n"${verse?.text}"\n\n`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Carregando versículo...</p>
        </div>
      </div>
    );
  }

  if (error || !verse || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
          <BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Versículo não encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Este versículo não existe.'}</p>
          <Link
            href="/verses"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
          >
            Ver todos os versículos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-4xl mx-auto p-6 flex items-center justify-between">
          <Link
            href="/verses"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Voltar</span>
          </Link>
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto p-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Referência */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-600 dark:text-purple-400 font-semibold">
                {book.name}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {book.name} {chapterNum}:{verseNum}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {book.testament === 'old' ? 'Antigo Testamento' : 'Novo Testamento'}
            </p>
          </div>

          {/* Texto do Versículo */}
          <div className="mb-8">
            <blockquote className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed text-center italic border-l-4 border-purple-500 pl-6 py-4">
              "{verse.text}"
            </blockquote>
          </div>

          {/* Ações */}
          <div className="flex gap-3 justify-center mb-8">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              <Share2 className="w-5 h-5" />
              {copied ? 'Copiado!' : 'Compartilhar'}
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold">
              <Heart className="w-5 h-5" />
              Favoritar
            </button>
          </div>

          {/* Navegação */}
          <div className="flex gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
            {navigation.previous ? (
              <Link
                href={`/verse/${navigation.previous.book}/${navigation.previous.chapter}/${navigation.previous.verse}`}
                className="flex-1 flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <ChevronLeft className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">Anterior</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Versículo {navigation.previous.verse}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl opacity-50 cursor-not-allowed">
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center">Primeiro versículo</p>
              </div>
            )}

            {navigation.next ? (
              <Link
                href={`/verse/${navigation.next.book}/${navigation.next.chapter}/${navigation.next.verse}`}
                className="flex-1 flex items-center justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">Próximo</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Versículo {navigation.next.verse}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <ChevronRight className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </Link>
            ) : (
              <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl opacity-50 cursor-not-allowed">
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center">Último versículo</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
