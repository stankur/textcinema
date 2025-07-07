"use client"

import { useState } from "react"

const useCases = {
  "youtube transcripts": {
    items: [
      "Hey everyone, welcome to my channel. Today I'm going to show you how to build a startup from scratch. The first thing you need to understand is product-market fit...",
      "In this video, I'll walk through the React useEffect hook and how to avoid infinite loops. Let's start with a basic example of fetching data...",
      "As a product manager, your main job is to bridge the gap between engineering and business. You need to understand both the technical constraints and the business goals...",
      "So I was debugging this memory leak in our Node.js application and found that we weren't properly cleaning up event listeners. Here's how I fixed it...",
      "Today we're going to talk about go-to-market strategy for B2B SaaS products. The key is to identify your ideal customer profile first..."
    ],
    suggestions: [
      "startup founders",
      "engineers", 
      "product managers"
    ]
  },
  "email inbox": {
    items: [
      "Hi John, thanks for reaching out about the partnership opportunity. I'd love to schedule a call next week to discuss this further. Best regards, Sarah",
      "🎉 FLASH SALE! 50% off all premium courses this weekend only! Use code SAVE50 at checkout. Limited time offer!",
      "Your account has been compromised. Click here immediately to verify your identity and secure your account. Urgent action required!",
      "Meeting reminder: Weekly standup tomorrow at 10 AM PST. Please prepare your updates on the current sprint progress.",
      "Re: Budget approval for Q1 marketing campaign. I've reviewed the proposal and have a few questions about the attribution model..."
    ],
    suggestions: [
      "need a reply",
      "advertisement",
      "likely spam"
    ]
  },
  "recipe list": {
    items: [
      "Grilled Salmon with Quinoa - Fresh Atlantic salmon seasoned with herbs, served with fluffy quinoa and steamed vegetables",
      "Classic Margherita Pizza - Wood-fired pizza with fresh mozzarella, basil, and San Marzano tomatoes on house-made dough",
      "Kung Pao Tofu - Crispy tofu cubes tossed in a spicy Sichuan sauce with peanuts, vegetables, and dried chilies",
      "Mediterranean Chickpea Salad - Protein-rich chickpeas with cucumber, tomatoes, red onion, and tahini dressing",
      "Beef and Broccoli Stir-fry - Tender beef strips with fresh broccoli in a savory garlic-ginger sauce over jasmine rice"
    ],
    suggestions: [
      "vegan",
      "pescatarian", 
      "Chinese food"
    ]
  },
  "customer feedback": {
    items: [
      "The mobile app keeps crashing when I try to upload photos. This has been happening for the past week and it's really frustrating.",
      "I love the new dashboard design! It would be awesome if you could add a dark mode option though. The bright white background strains my eyes during long work sessions.",
      "Your customer service team was incredibly helpful when I had billing questions. They resolved everything quickly and professionally.",
      "The search functionality is too slow. Sometimes it takes 10+ seconds to find what I'm looking for, which really hurts productivity.",
      "Could you please add keyboard shortcuts for common actions? As a power user, I'd love to navigate the app without always reaching for the mouse."
    ],
    suggestions: [
      "feature request",
      "bug"
    ]
  }
}

export default function FilteringDemo() {
  const [selectedUseCase, setSelectedUseCase] = useState<keyof typeof useCases>("youtube transcripts")
  const [filterPrompt, setFilterPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [filteredResults, setFilteredResults] = useState<boolean[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const currentData = useCases[selectedUseCase]

  const handleSuggestionClick = (suggestion: string) => {
    setFilterPrompt(`Is this ${suggestion}?`)
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
    
    // Simulate API calls with realistic delays
    const results: boolean[] = []
    for (let i = 0; i < currentData.items.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      // Simulate LLM response (in real app, this would call OpenAI)
      const mockResult = Math.random() > 0.6 // Random for demo
      results.push(mockResult)
      setFilteredResults([...results])
    }
    
    setIsLoading(false)
  }

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <div className="space-y-6">
      {/* Use Case Chips */}
      <div className="flex justify-center gap-8">
        {Object.keys(useCases).map((useCase) => (
          <button
            key={useCase}
            onClick={() => {
              setSelectedUseCase(useCase as keyof typeof useCases)
              setFilterPrompt("")
              setFilteredResults([])
              setExpandedItems(new Set())
            }}
            className={`text-sm transition-colors ${
              selectedUseCase === useCase
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {useCase}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Filtering Prompt */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={filterPrompt}
              onChange={(e) => setFilterPrompt(e.target.value)}
              placeholder="Enter filtering criteria..."
              className="w-full h-32 px-3 py-2 pr-12 bg-gray-900/50 border border-gray-700 rounded text-white placeholder-gray-400 resize-none focus:outline-none focus:border-gray-600"
            />
            <button
              onClick={runFilter}
              disabled={!filterPrompt.trim() || isLoading}
              className="absolute bottom-2 right-2 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          
          <div className="flex flex-wrap gap-2">
            {currentData.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-2 py-1 text-xs text-gray-400 border border-gray-600 rounded hover:text-white hover:border-gray-500 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Items */}
        <div className="space-y-3">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {currentData.items.map((item, index) => {
              const isExpanded = expandedItems.has(index)
              const isHighlighted = filteredResults[index] === true
              const isProcessing = isLoading && filteredResults.length <= index
              
              return (
                <div
                  key={index}
                  className={`p-3 border rounded transition-all ${
                    isHighlighted 
                      ? 'border-green-600 bg-green-500/10' 
                      : 'border-gray-800 bg-transparent'
                  } ${isProcessing ? 'animate-pulse' : ''}`}
                >
                  <p 
                    className="text-sm cursor-pointer text-gray-300"
                    onClick={() => toggleExpanded(index)}
                  >
                    {isExpanded ? item : truncateText(item)}
                  </p>
                  {!isExpanded && item.length > 120 && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="text-xs text-gray-500 hover:text-gray-400 mt-1"
                    >
                      Show more
                    </button>
                  )}
                  {isExpanded && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="text-xs text-gray-500 hover:text-gray-400 mt-1"
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