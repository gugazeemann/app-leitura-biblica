'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

export default function ImportPage() {
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleImport = async () => {
    setImporting(true)
    setResults(null)

    try {
      const response = await fetch('/api/import-bible', {
        method: 'POST'
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      setResults({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao importar'
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Importação da Bíblia para o Supabase
          </h1>

          <div className="text-center mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Clique no botão abaixo para importar todos os 66 livros da Bíblia
              com seus capítulos e versículos diretamente para o banco de dados.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Button
              onClick={handleImport}
              disabled={importing}
              size="lg"
              className="px-8"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Importando...
                </>
              ) : (
                'Iniciar Importação'
              )}
            </Button>
          </div>

          {results && (
            <div className="mt-8">
              <div
                className={`p-4 rounded-lg mb-4 ${
                  results.success
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {results.success ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <p className="font-semibold">{results.message}</p>
                </div>
              </div>

              {results.results && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.results.map((result: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg flex items-center justify-between ${
                        result.success
                          ? 'bg-green-50 dark:bg-green-900/10'
                          : 'bg-red-50 dark:bg-red-900/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">{result.book}</span>
                      </div>
                      {result.success ? (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {result.verses} versículos
                        </span>
                      ) : (
                        <span className="text-sm text-red-600 dark:text-red-400">
                          {result.error}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
