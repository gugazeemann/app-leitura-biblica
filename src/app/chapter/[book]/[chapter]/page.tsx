'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { getVerses, searchVerses } from '@/lib/data';
import { BOOKS, KEYWORDS } from '@/lib/constants';

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.book as string;
  const chapterNum = parseInt(params.chapter as string);

  const [verses, setVerses] = useState<any[]>([]);
  const [bookData, setBookData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Buscar dados do livro
    const book = BOOKS.find(b => b.id === bookId);
    setBookData(book);

    // Buscar versículos do capítulo
    const chapterVerses = getVerses(bookId, chapterNum);
    setVerses(chapterVerses);
  }, [bookId, chapterNum]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results: any[] = [];
    const lowerQuery = query.toLowerCase();

    // Buscar livros
    BOOKS.forEach(book => {
      if (book.name.toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'book', data: book });
      }
    });

    // Buscar palavras-chave
    KEYWORDS.forEach(keyword => {
      if (keyword.toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'keyword', data: keyword });
      }
    });

    // Buscar versículos
    const foundVerses = searchVerses(query);
    foundVerses.slice(0, 5).forEach(verse => {
      results.push({ type: 'verse', data: verse });
    });

    setSearchResults(results);
    setShowResults(true);
  };

  if (!bookData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>

            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {bookData.name} - Capítulo {chapterNum}
              </h1>
            </div>

            <div className="w-9" />
          </div>

          {/* Campo de busca */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar livros, capítulos, versículos..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Resultados da busca */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto z-50">
                {searchResults.map((result, index) => {
                  let href = '/';
                  
                  if (result.type === 'book') {
                    href = `/chapter/${result.data.id.toLowerCase()}/1`;
                  } else if (result.type === 'verse') {
                    href = `/verse/${result.data.book.toLowerCase()}/${result.data.chapter}/${result.data.verse}`;
                  } else if (result.type === 'keyword') {
                    href = '/';
                  }

                  return (
                    <Link
                      key={index}
                      href={href}
                      onClick={() => setShowResults(false)}
                      className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                    >
                      {result.type === 'book' && (
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Livro
                          </div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {result.data.name}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {result.data.chapters} capítulos
                          </div>
                        </div>
                      )}
                      {result.type === 'keyword' && (
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Tema
                          </div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                            {result.data}
                          </div>
                        </div>
                      )}
                      {result.type === 'verse' && (
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Versículo
                          </div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                            {result.data.book} {result.data.chapter}:{result.data.verse}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {result.data.text}
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo - Leitura contínua */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {verses.length > 0 ? (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border-2 border-slate-200 dark:border-slate-700">
              <div className="space-y-6">
                {verses.map((verse) => (
                  <Link
                    key={verse.verse}
                    href={`/verse/${bookId}/${chapterNum}/${verse.verse}`}
                    className="block group hover:bg-slate-50 dark:hover:bg-slate-700/50 -mx-4 px-4 py-4 rounded-xl transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 text-right">
                        <span className="text-sm font-bold text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                          {verse.verse}
                        </span>
                      </div>
                      <p className="flex-1 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                        {verse.text}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navegação entre capítulos */}
            <div className="mt-8 flex gap-4">
              {chapterNum > 1 && (
                <Link
                  href={`/chapter/${bookId}/${chapterNum - 1}`}
                  className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 text-center"
                >
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Capítulo anterior
                  </div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Capítulo {chapterNum - 1}
                  </div>
                </Link>
              )}
              
              {chapterNum < bookData.chapters && (
                <Link
                  href={`/chapter/${bookId}/${chapterNum + 1}`}
                  className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 text-center"
                >
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Próximo capítulo
                  </div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Capítulo {chapterNum + 1}
                  </div>
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border-2 border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Este capítulo ainda não foi importado. Use a página de importação para adicionar o conteúdo da Bíblia.
            </p>
            <Link
              href="/import"
              className="mt-4 inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Ir para Importação
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
