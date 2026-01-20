'use client'

import React, { useState, useEffect } from 'react'
import Toast from './Toast'

interface PreviewPanelProps {
  code: string
  isLoading: boolean
}

export default function PreviewPanel({ code, isLoading }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [iframeKey, setIframeKey] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (code) {
      setIframeKey(prev => prev + 1)
    }
  }, [code])

  const handleDownload = () => {
    if (!code) return

    const blob = new Blob([code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `website-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setToastMessage('Code copied to clipboard!')
      setShowToast(true)
    }).catch(() => {
      setToastMessage('Failed to copy code')
      setShowToast(true)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Preview</h2>
          {code && (
            <div className="flex space-x-2">
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                📋 Copy Code
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
              >
                ⬇️ Download HTML
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'preview'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'code'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative" style={{ height: 'calc(100vh - 250px)', minHeight: '500px' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 font-medium">Generating your website...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          </div>
        ) : !code ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No website generated yet</p>
              <p className="text-sm mt-2">Describe your website and click Generate</p>
            </div>
          </div>
        ) : activeTab === 'preview' ? (
          <iframe
            key={iframeKey}
            srcDoc={code}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Website Preview"
          />
        ) : (
          <div className="h-full overflow-auto p-4 bg-gray-900">
            <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap break-words">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}
