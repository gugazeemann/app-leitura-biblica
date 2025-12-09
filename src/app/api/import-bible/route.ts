import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST() {
  try {
    const supabase = createClient()
    
    // Mapeamento de slugs dos arquivos JSON para IDs do banco
    const slugMapping: Record<string, string> = {
      '1samuel': '1-samuel',
      '2samuel': '2-samuel',
      '1kings': '1-kings',
      '2kings': '2-kings',
      '1chronicles': '1-chronicles',
      '2chronicles': '2-chronicles',
      'songofsolomon': 'song-of-solomon',
      '1corinthians': '1-corinthians',
      '2corinthians': '2-corinthians',
      '1thessalonians': '1-thessalonians',
      '2thessalonians': '2-thessalonians',
      '1timothy': '1-timothy',
      '2timothy': '2-timothy',
      '1peter': '1-peter',
      '2peter': '2-peter',
      '1john': '1-john',
      '2john': '2-john',
      '3john': '3-john'
    }

    // Ler lista de livros
    const booksPath = path.join(process.cwd(), 'public', 'bible', 'books.json')
    const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf-8'))
    
    let totalVerses = 0
    const results = []

    for (const book of booksData.books) {
      const bookSlug = book.slug
      const bookId = slugMapping[bookSlug] || bookSlug
      
      try {
        // Ler arquivo do livro
        const bookPath = path.join(process.cwd(), 'public', 'bible', `${bookSlug}.json`)
        const bookContent = JSON.parse(fs.readFileSync(bookPath, 'utf-8'))
        
        const bookKey = Object.keys(bookContent)[0]
        const chapters = bookContent[bookKey]
        
        // Preparar versículos
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
        
        // Inserir versículos em lotes
        const batchSize = 1000
        for (let i = 0; i < verses.length; i += batchSize) {
          const batch = verses.slice(i, i + batchSize)
          const { error } = await supabase
            .from('verses')
            .insert(batch)
          
          if (error) {
            console.error(`Erro ao inserir ${book.name}:`, error)
            throw error
          }
        }
        
        totalVerses += verses.length
        results.push({
          book: book.name,
          verses: verses.length,
          success: true
        })
        
        console.log(`✅ ${book.name}: ${verses.length} versículos importados`)
        
      } catch (error) {
        console.error(`❌ Erro ao importar ${book.name}:`, error)
        results.push({
          book: book.name,
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Importação concluída! ${totalVerses} versículos importados de ${results.filter(r => r.success).length}/${results.length} livros`,
      results
    })
    
  } catch (error) {
    console.error('Erro na importação:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
