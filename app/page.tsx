'use client'

import { useState } from 'react'
import WebsiteGenerator from '@/components/WebsiteGenerator'
import PreviewPanel from '@/components/PreviewPanel'

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Website Generator
          </h1>
          <p className="text-xl text-gray-600">
            Describe your dream website, and let AI build it for you
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WebsiteGenerator 
            onGenerate={setGeneratedCode}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <PreviewPanel 
            code={generatedCode}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  )
}
