'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Search, X, Home } from 'lucide-react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Book {
  id: string; // slug do livro (ex: 'genesis')
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

interface GroupedVerses {
  [bookId: string]: {
    book: Book;
    chapters: {
      [chapterNum: number]: Verse[];
    };
  };
}

export default function AllVersesPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [groupedVerses, setGroupedVerses] = useState<GroupedVerses>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedTestament, setSelectedTestament] = useState<'all' | 'old' | 'new'>('all');

  useEffect(() => {
    loadBibleData();
  }, []);

  useEffect(() => {
    // Filtrar livros por testamento e busca
    let filtered = books;

    if (selectedTestament !== 'all') {
      filtered = filtered.filter(book => book.testament === selectedTestament);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(book => 
        book.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [books, selectedTestament, searchQuery]);

  const loadBibleData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured() || !supabase) {
        setError('Supabase não está configurado. Configure suas credenciais para visualizar os versículos.');
        setLoading(false);
        return;
      }

      // Carregar todos os livros
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .order('id', { ascending: true });

      if (booksError) {
        throw new Error(`Erro ao carregar livros: ${booksError.message}`);
      }

      if (!booksData || booksData.length === 0) {
        setError('Nenhum livro encontrado. Importe a Bíblia primeiro em /import');
        setLoading(false);
        return;
      }

      setBooks(booksData);

      // Carregar todos os versículos
      const { data: versesData, error: versesError } = await supabase
        .from('verses')
        .select('*')
        .order('book_id', { ascending: true })
        .order('chapter_number', { ascending: true })
        .order('verse_number', { ascending: true });

      if (versesError) {
        throw new Error(`Erro ao carregar versículos: ${versesError.message}`);
      }

      if (!versesData || versesData.length === 0) {
        setError('Nenhum versículo encontrado. Importe a Bíblia primeiro em /import');
        setLoading(false);
        return;
      }

      setVerses(versesData);

      // Agrupar versículos por livro e capítulo
      const grouped: GroupedVerses = {};

      booksData.forEach(book => {
        grouped[book.id] = {
          book,
          chapters: {}
        };
      });

      versesData.forEach(verse => {
        if (!grouped[verse.book_id]) {
          return; // Pular se o livro não existe
        }
        if (!grouped[verse.book_id].chapters[verse.chapter_number]) {
          grouped[verse.book_id].chapters[verse.chapter_number] = [];
        }
        grouped[verse.book_id].chapters[verse.chapter_number].push(verse);
      });

      setGroupedVerses(grouped);
      setLoading(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados');
      setLoading(false);
    }
  };

  const toggleBook = (bookId: string) => {
    const newExpanded = new Set(expandedBooks);
    if (newExpanded.has(bookId)) {
      newExpanded.delete(bookId);
      // Fechar todos os capítulos deste livro
      const newExpandedChapters = new Set(expandedChapters);
      Array.from(expandedChapters).forEach(key => {
        if (key.startsWith(`${bookId}-`)) {
          newExpandedChapters.delete(key);
        }
      });
      setExpandedChapters(newExpandedChapters);
    } else {
      newExpanded.add(bookId);
    }
    setExpandedBooks(newExpanded);
  };

  const toggleChapter = (bookId: string, chapterNum: number) => {
    const key = `${bookId}-${chapterNum}`;
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedChapters(newExpanded);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Carregando versículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Erro ao Carregar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              Voltar
            </Link>
            <Link
              href="/import"
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
            >
              Importar Bíblia
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 pb-6">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              >
                <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  Todos os Versículos
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {verses.length.toLocaleString()} versículos em {books.length} livros
                </p>
              </div>
            </div>
          </div>

          {/* Busca e Filtros */}
          <div className="space-y-3">
            {/* Campo de Busca */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar livro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filtro de Testamento */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTestament('all')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  selectedTestament === 'all'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Todos ({books.length})
              </button>
              <button
                onClick={() => setSelectedTestament('old')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  selectedTestament === 'old'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Antigo ({books.filter(b => b.testament === 'old').length})
              </button>
              <button
                onClick={() => setSelectedTestament('new')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  selectedTestament === 'new'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Novo ({books.filter(b => b.testament === 'new').length})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Lista de Livros */}
      <main className="max-w-6xl mx-auto p-6">
        {filteredBooks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum livro encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar os filtros ou a busca
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map(book => {
              const bookData = groupedVerses[book.id];
              if (!bookData) return null;

              const isBookExpanded = expandedBooks.has(book.id);
              const chapterNumbers = Object.keys(bookData.chapters).map(Number).sort((a, b) => a - b);

              return (
                <div
                  key={book.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
                >
                  {/* Cabeçalho do Livro */}
                  <button
                    onClick={() => toggleBook(book.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        book.testament === 'old'
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-green-100 dark:bg-green-900/30'
                      }`}>
                        <BookOpen className={`w-6 h-6 ${
                          book.testament === 'old'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-green-600 dark:text-green-400'
                        }`} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {book.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {book.chapters} capítulos • {book.testament === 'old' ? 'Antigo Testamento' : 'Novo Testamento'}
                        </p>
                      </div>
                    </div>
                    {isBookExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </button>

                  {/* Capítulos do Livro */}
                  {isBookExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                      {chapterNumbers.map(chapterNum => {
                        const chapterVerses = bookData.chapters[chapterNum];
                        const chapterKey = `${book.id}-${chapterNum}`;
                        const isChapterExpanded = expandedChapters.has(chapterKey);

                        return (
                          <div
                            key={chapterKey}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden"
                          >
                            {/* Cabeçalho do Capítulo */}
                            <button
                              onClick={() => toggleChapter(book.id, chapterNum)}
                              className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                                    {chapterNum}
                                  </span>
                                </div>
                                <div className="text-left">
                                  <h4 className="font-semibold text-gray-900 dark:text-white">
                                    Capítulo {chapterNum}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {chapterVerses.length} versículos
                                  </p>
                                </div>
                              </div>
                              {isChapterExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </button>

                            {/* Versículos do Capítulo */}
                            {isChapterExpanded && (
                              <div className="border-t border-gray-200 dark:border-gray-600 p-4 space-y-3">
                                {chapterVerses.map(verse => (
                                  <Link
                                    key={verse.id}
                                    href={`/verse/${book.id}/${verse.chapter_number}/${verse.verse_number}`}
                                    className="flex gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                                  >
                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold text-sm group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                      {verse.verse_number}
                                    </span>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                      {verse.text}
                                    </p>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
