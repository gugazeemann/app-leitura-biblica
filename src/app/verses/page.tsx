'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Book {
  id: number;
  name: string;
  abbreviation: string;
  testament: string;
}

interface Verse {
  id: number;
  book_id: number;
  chapter_number: number;
  verse_number: number;
  text: string;
}

interface VerseWithBook extends Verse {
  book_name: string;
  book_abbreviation: string;
}

export default function VersesPage() {
  const [verses, setVerses] = useState<VerseWithBook[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestament, setSelectedTestament] = useState<'all' | 'old' | 'new'>('all');
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedTestament, selectedBook]);

  const loadData = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // 1. Busca todos os livros primeiro
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .order('id', { ascending: true });

      if (booksError) {
        console.error('Erro ao buscar livros:', booksError);
        setLoading(false);
        return;
      }

      if (!booksData || booksData.length === 0) {
        console.error('Nenhum livro encontrado no banco de dados');
        setLoading(false);
        return;
      }

      setBooks(booksData);

      // Cria um mapa de livros para lookup rápido
      const booksMap = new Map(booksData.map(book => [book.id, book]));

      // 2. Monta query de versículos SEM JOIN (busca simples)
      let query = supabase
        .from('verses')
        .select('id, book_id, chapter_number, verse_number, text')
        .order('book_id', { ascending: true })
        .order('chapter_number', { ascending: true })
        .order('verse_number', { ascending: true })
        .limit(100);

      // Aplica filtro de livro
      if (selectedBook) {
        query = query.eq('book_id', selectedBook);
      } else if (selectedTestament !== 'all') {
        // Filtra por testamento
        const bookIds = booksData
          .filter(book => book.testament === selectedTestament)
          .map(book => book.id);
        
        if (bookIds.length > 0) {
          query = query.in('book_id', bookIds);
        }
      }

      const { data: versesData, error: versesError } = await query;

      if (versesError) {
        console.error('Erro ao buscar versículos:', versesError);
      } else if (versesData) {
        // 3. Faz o JOIN manualmente no JavaScript
        const versesWithBooks: VerseWithBook[] = versesData.map(verse => {
          const book = booksMap.get(verse.book_id);
          return {
            ...verse,
            book_name: book?.name || 'Desconhecido',
            book_abbreviation: book?.abbreviation || '?'
          };
        });
        
        setVerses(versesWithBooks);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtra versículos pela busca
  const filteredVerses = verses.filter(verse => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      verse.text.toLowerCase().includes(query) ||
      verse.book_name.toLowerCase().includes(query) ||
      verse.book_abbreviation.toLowerCase().includes(query)
    );
  });

  const clearFilters = () => {
    setSelectedTestament('all');
    setSelectedBook(null);
    setSearchQuery('');
  };

  const filteredBooks = books.filter(book => {
    if (selectedTestament === 'all') return true;
    return book.testament === selectedTestament;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 pb-8">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                Todos os Versículos
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Explore a Bíblia completa
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Busca */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar versículos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Painel de Filtros */}
        {showFilters && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="max-w-6xl mx-auto px-6 py-4">
              {/* Filtro de Testamento */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Testamento
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTestament('all');
                      setSelectedBook(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTestament === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTestament('old');
                      setSelectedBook(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTestament === 'old'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    Antigo
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTestament('new');
                      setSelectedBook(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTestament === 'new'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    Novo
                  </button>
                </div>
              </div>

              {/* Filtro de Livro */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Livro
                </label>
                <select
                  value={selectedBook || ''}
                  onChange={(e) => setSelectedBook(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Todos os livros</option>
                  {filteredBooks.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão Limpar Filtros */}
              {(selectedTestament !== 'all' || selectedBook || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Lista de Versículos */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando versículos...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-2">
              Nenhum livro encontrado no banco de dados
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Verifique se a tabela 'books' está populada corretamente
            </p>
          </div>
        ) : filteredVerses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Nenhum versículo encontrado
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Tente ajustar os filtros ou a busca
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVerses.map((verse) => (
              <div
                key={verse.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {verse.book_abbreviation}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {verse.book_name} {verse.chapter_number}:{verse.verse_number}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {verse.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info sobre limite */}
        {!loading && filteredVerses.length === 100 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando os primeiros 100 versículos. Use os filtros para refinar sua busca.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
