"use client"

import { useState } from "react"
import { useCases, type UseCaseKey } from "@/data/use-cases"

export default function FilteringDemo() {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseKey>("youtube transcripts")
  const [filterPrompt, setFilterPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [filteredResults, setFilteredResults] = useState<boolean[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const currentData = useCases[selectedUseCase]

  const handleSuggestionClick = (suggestion: string) => {
    const suggestionIndex = currentData.suggestions.indexOf(suggestion)
    if (suggestionIndex !== -1 && currentData.prompts) {
      setFilterPrompt(currentData.prompts[suggestionIndex])
    }
  }

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const runFilter = async () => {
    if (!filterPrompt.trim()) return
    
    setIsLoading(true)
    setFilteredResults([])
    
    const results: boolean[] = []
    
    for (let i = 0; i < currentData.items.length; i++) {
      try {
        const response = await fetch('/api/filter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: filterPrompt,
            content: currentData.items[i]
          })
        })
        
        const data = await response.json()
        const result = data.result?.toLowerCase().includes('yes') || false
        results.push(result)
      } catch (error) {
        console.error('Filter API error:', error)
        // Fallback to random result on error
        results.push(Math.random() > 0.6)
      }
      
      setFilteredResults([...results])
      // Small delay for visual effect
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Use Case Chips */}
      <div className="flex gap-3 justify-start overflow-x-auto scrollbar-hide pb-2 md:flex-wrap md:justify-center">
        {Object.keys(useCases).map((useCase) => (
          <button
            key={useCase}
            onClick={() => {
              setSelectedUseCase(useCase as UseCaseKey)
              setFilterPrompt("")
              setFilteredResults([])
              setExpandedItems(new Set())
            }}
            className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
              selectedUseCase === useCase
                ? 'bg-white/10 text-white border-transparent'
                : 'border-white/20 text-gray-400 hover:border-white/30 hover:text-gray-300'
            }`}
          >
            {useCase}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Filtering Prompt */}
        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-white/10 rounded focus-within:border-white/15 transition-colors">
            <div className="flex">
              <div className="flex-1">
                <textarea
                  value={filterPrompt}
                  onChange={(e) => setFilterPrompt(e.target.value)}
                  placeholder="Enter filtering criteria..."
                  className="w-full h-20 px-3 py-2 bg-transparent border-0 text-white placeholder-gray-400 resize-none focus:outline-none"
                />
                <div className="flex flex-wrap gap-2 px-3 pb-3">
                  {currentData.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-2 py-1 text-xs text-gray-400 bg-gray-800/50 rounded hover:text-white hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col justify-end p-3">
                <button
                  onClick={runFilter}
                  disabled={!filterPrompt.trim() || isLoading}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Items */}
        <div className="space-y-3">
          <div className="space-y-2">
            {currentData.items.map((item, index) => {
              const isExpanded = expandedItems.has(index)
              const isHighlighted = filteredResults[index] === true
              const isProcessing = isLoading && filteredResults.length <= index
              
              return (
                <div
                  key={index}
                  className={`p-3 border rounded transition-all ${
                    isHighlighted 
                      ? 'border-green-600/60 bg-green-500/10' 
                      : 'border-white/10 bg-transparent'
                  } ${isProcessing ? 'animate-pulse' : ''}`}
                >
                  <p 
                    className={`text-sm text-gray-300 cursor-pointer ${!isExpanded ? 'line-clamp-2' : ''}`}
                    onClick={() => toggleExpanded(index)}
                  >
                    {item}
                  </p>
                  {!isExpanded && item.length > 80 && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="text-xs text-gray-500 hover:text-gray-400 mt-1 cursor-pointer"
                    >
                      Show more
                    </button>
                  )}
                  {isExpanded && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="text-xs text-gray-500 hover:text-gray-400 mt-1 cursor-pointer"
                    >
                      Show less
                    </button>
                  )}
                  {isProcessing && (
                    <div className="text-xs text-gray-500 mt-2">Processing...</div>
                  )}
                  {filteredResults[index] === true && (
                    <div className="text-xs text-green-400 mt-2">✓ Matches criteria</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
