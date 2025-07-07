"use client"

import { useState, useMemo } from "react"

const models = {
  "claude-sonnet-4": {
    inputCost: 3,
    outputCost: 15
  },
  "gemini-2.5-flash-preview": {
    inputCost: 0.15,
    outputCost: 0.60
  },
  "gpt-4.1": {
    inputCost: 2,
    outputCost: 8
  }
}

const useCaseData = {
  "youtube transcripts": {
    itemCount: 5,
    avgTokensPerItem: 150,
    promptTokens: 25
  },
  "email inbox": {
    itemCount: 5,
    avgTokensPerItem: 80,
    promptTokens: 20
  },
  "recipe list": {
    itemCount: 5,
    avgTokensPerItem: 60,
    promptTokens: 15
  },
  "customer feedback": {
    itemCount: 5,
    avgTokensPerItem: 100,
    promptTokens: 20
  }
}

export default function CostEstimator() {
  const [selectedUseCase, setSelectedUseCase] = useState<keyof typeof useCaseData>("youtube transcripts")
  const [selectedModel, setSelectedModel] = useState<keyof typeof models>("claude-sonnet-4")
  const [customPrompt, setCustomPrompt] = useState("")

  const currentData = useCaseData[selectedUseCase]
  const currentModel = models[selectedModel]

  const estimatedCost = useMemo(() => {
    const promptTokens = customPrompt ? Math.ceil(customPrompt.length / 4) : currentData.promptTokens
    const inputTokensPerItem = promptTokens + currentData.avgTokensPerItem
    const outputTokensPerItem = 2 // Simple YES/NO
    
    const totalInputTokens = currentData.itemCount * inputTokensPerItem
    const totalOutputTokens = currentData.itemCount * outputTokensPerItem
    
    const inputCost = (totalInputTokens / 1_000_000) * currentModel.inputCost
    const outputCost = (totalOutputTokens / 1_000_000) * currentModel.outputCost
    
    return {
      inputCost,
      outputCost,
      total: inputCost + outputCost,
      totalInputTokens,
      totalOutputTokens,
      inputTokensPerItem,
      outputTokensPerItem,
      promptTokens
    }
  }, [customPrompt, currentData, currentModel])

  return (
    <div className="space-y-6">
      {/* Use Case Chips */}
      <div className="flex justify-center gap-8">
        {Object.keys(useCaseData).map((useCase) => (
          <button
            key={useCase}
            onClick={() => setSelectedUseCase(useCase as keyof typeof useCaseData)}
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

      {/* Cost Formula */}
      <div className="text-sm font-mono text-center text-gray-400 border border-white/10 rounded p-3">
        max cost = (# items) × ((model input cost) × (filtering prompt size + average tokens per item) + model output cost)
      </div>

      {/* Model Selection */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(models).map(([modelKey, model]) => (
          <button
            key={modelKey}
            onClick={() => setSelectedModel(modelKey as keyof typeof models)}
            className={`px-3 py-2 text-sm border rounded transition-colors ${
              selectedModel === modelKey
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            <div className="text-left">
              <div className="font-medium">{modelKey}</div>
              <div className="text-xs opacity-75">
                ${model.inputCost}/M input • ${model.outputCost}/M output
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Prompt */}
      <div>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter filtering prompt to estimate tokens..."
          className="w-full h-20 px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white/20 text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          ~{estimatedCost.promptTokens} tokens
        </p>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-sm space-y-1 text-gray-400">
            <div>Items: {currentData.itemCount}</div>
            <div>Prompt tokens: {estimatedCost.promptTokens}</div>
            <div>Avg tokens per item: {currentData.avgTokensPerItem}</div>
            <div>Input tokens per item: {estimatedCost.inputTokensPerItem}</div>
            <div>Total input tokens: {estimatedCost.totalInputTokens.toLocaleString()}</div>
            <div className="text-white">
              Input cost: ${estimatedCost.inputCost.toFixed(6)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm space-y-1 text-gray-400">
            <div>Items: {currentData.itemCount}</div>
            <div>Output tokens per item: {estimatedCost.outputTokensPerItem} (YES/NO)</div>
            <div>Total output tokens: {estimatedCost.totalOutputTokens}</div>
            <div className="text-white">
              Output cost: ${estimatedCost.outputCost.toFixed(6)}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="text-lg font-bold text-center text-white">
          Total: ${estimatedCost.total.toFixed(6)}
        </div>
      </div>
    </div>
  )
}
