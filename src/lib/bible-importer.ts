import { createClient } from '@/lib/supabase'

export interface BibleBook {
  name: string
  slug: string
  chapters: number
  testament: 'old' | 'new'
}

export interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
}

/**
 * Importa um livro da Bíblia do JSON para o Supabase
 * @param bookSlug - slug do livro (ex: 'genesis', 'exodus')
 */
export async function importBook(bookSlug: string): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const supabase = createClient()
    
    // Buscar informações do livro
    const booksResponse = await fetch('/bible/books.json')
    const booksData = await booksResponse.json()
    const bookInfo = booksData.books.find((b: BibleBook) => b.slug === bookSlug)
    
    if (!bookInfo) {
      return { success: false, message: `Livro ${bookSlug} não encontrado no índice` }
    }

    // Buscar dados do livro
    const bookResponse = await fetch(`/bible/${bookSlug}.json`)
    if (!bookResponse.ok) {
      return { success: false, message: `Arquivo ${bookSlug}.json não encontrado` }
    }
    
    const bookData = await bookResponse.json()
    const bookKey = Object.keys(bookData)[0] // Ex: "Genesis"
    const chapters = bookData[bookKey]

    // Verificar se o livro já existe (id é o slug)
    const { data: existingBook } = await supabase
      .from('books')
      .select('id')
      .eq('id', bookSlug)
      .single()

    let bookId: string

    if (existingBook) {
      bookId = existingBook.id
      console.log(`Livro ${bookInfo.name} já existe, atualizando versículos...`)
    } else {
      // Inserir livro (id é o slug)
      const { data: newBook, error: bookError } = await supabase
        .from('books')
        .insert({
          id: bookSlug,
          name: bookInfo.name,
          chapters: bookInfo.chapters,
          testament: bookInfo.testament
        })
        .select('id')
        .single()

      if (bookError || !newBook) {
        return { success: false, message: `Erro ao inserir livro: ${bookError?.message}` }
      }

      bookId = newBook.id
    }

    // Preparar versículos para inserção
    const verses: Array<{
      book_id: string
      chapter_number: number
      verse_number: number
      text: string
    }> = []

    for (const [chapterNum, chapterVerses] of Object.entries(chapters)) {
      for (const [verseNum, verseText] of Object.entries(chapterVerses as Record<string, string>)) {
        verses.push({
          book_id: bookId,
          chapter_number: parseInt(chapterNum),
          verse_number: parseInt(verseNum),
          text: verseText
        })
      }
    }

    // Deletar versículos existentes do livro (para evitar duplicatas)
    await supabase
      .from('verses')
      .delete()
      .eq('book_id', bookId)

    // Inserir versículos em lotes de 1000
    const batchSize = 1000
    let insertedCount = 0

    for (let i = 0; i < verses.length; i += batchSize) {
      const batch = verses.slice(i, i + batchSize)
      const { error: versesError } = await supabase
        .from('verses')
        .insert(batch)

      if (versesError) {
        return { 
          success: false, 
          message: `Erro ao inserir versículos (lote ${Math.floor(i / batchSize) + 1}): ${versesError.message}` 
        }
      }

      insertedCount += batch.length
    }

    return { 
      success: true, 
      message: `Livro ${bookInfo.name} importado com sucesso!`,
      count: insertedCount
    }

  } catch (error) {
    return { 
      success: false, 
      message: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
    }
  }
}

/**
 * Importa todos os livros da Bíblia
 */
export async function importAllBooks(): Promise<{ success: boolean; message: string; results: Array<{ book: string; success: boolean; count?: number }> }> {
  try {
    const booksResponse = await fetch('/bible/books.json')
    const booksData = await booksResponse.json()
    
    const results: Array<{ book: string; success: boolean; count?: number }> = []

    for (const book of booksData.books) {
      const result = await importBook(book.slug)
      results.push({
        book: book.name,
        success: result.success,
        count: result.count
      })
      
      if (!result.success) {
        console.error(`Erro ao importar ${book.name}:`, result.message)
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalVerses = results.reduce((sum, r) => sum + (r.count || 0), 0)

    return {
      success: successCount === results.length,
      message: `Importação concluída: ${successCount}/${results.length} livros importados com sucesso (${totalVerses} versículos)`,
      results
    }

  } catch (error) {
    return {
      success: false,
      message: `Erro ao importar livros: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      results: []
    }
  }
}
