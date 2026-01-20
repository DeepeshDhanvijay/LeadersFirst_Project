'use client'

import React, { useState } from 'react'
import axios from 'axios'

interface WebsiteGeneratorProps {
  onGenerate: (code: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function WebsiteGenerator({ onGenerate, isLoading, setIsLoading }: WebsiteGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [websiteType, setWebsiteType] = useState('general')
  const [saveToDatabase, setSaveToDatabase] = useState(true)
  const [error, setError] = useState('')

  const websiteTypes = [
    { value: 'general', label: 'General Website' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'blog', label: 'Blog' },
    { value: 'landing', label: 'Landing Page' },
    { value: 'business', label: 'Business Website' },
  ]

  const examplePrompts = [
    'Create a portfolio website for a photographer with a gallery section',
    'Build an e-commerce site for handmade jewelry with product cards',
    'Design a modern landing page for a SaaS product',
    'Create a personal blog with article cards and author bio',
    'Build a restaurant website with menu and reservation form',
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a website description')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post('/api/generate', {
        prompt: prompt.trim(),
        websiteType,
        saveToDatabase
      })

      if (response.data.success) {
        onGenerate(response.data.html)
        setError('')
      } else {
        setError(response.data.error || 'Failed to generate website')
      }
    } catch (err: any) {
      console.error('Generation error:', err)
      setError(err.response?.data?.error || 'An error occurred while generating the website')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Describe Your Website</h2>

      <div className="space-y-4">
        {/* Website Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website Type
          </label>
          <select
            value={websiteType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setWebsiteType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            {websiteTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website Description
          </label>
          <textarea
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            placeholder="Describe the website you want to create... Be specific about layout, colors, sections, and content."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500 mt-1">
            {prompt.length} characters
          </p>
        </div>

        {/* Example Prompts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Example Prompts (click to use)
          </label>
          <div className="space-y-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition"
                disabled={isLoading}
              >
                💡 {example}
              </button>
            ))}
          </div>
        </div>

        {/* Save to Database Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveToDatabase"
            checked={saveToDatabase}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaveToDatabase(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isLoading}
          />
          <label htmlFor="saveToDatabase" className="ml-2 text-sm text-gray-700">
            Save generated website to database
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            isLoading || !prompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            '✨ Generate Website'
          )}
        </button>
      </div>
    </div>
  )
}
