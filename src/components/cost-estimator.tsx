"use client"

import { useState, useMemo } from "react"
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'
import { useCases, type UseCaseKey } from "@/data/use-cases"

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


export default function CostEstimator() {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseKey>("youtube transcripts")
  const [selectedModel, setSelectedModel] = useState<keyof typeof models>("claude-sonnet-4")
  const [customPrompt, setCustomPrompt] = useState("")

  const currentData = useCases[selectedUseCase]
  const currentModel = models[selectedModel]

  const handleSuggestionClick = (suggestion: string) => {
    const suggestionIndex = currentData.suggestions.indexOf(suggestion)
    if (suggestionIndex !== -1 && currentData.prompts) {
      setCustomPrompt(currentData.prompts[suggestionIndex])
    }
  }

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
		<div className="space-y-12">
			{/* Use Case Chips */}
			<div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
				{Object.keys(useCases).map((useCase) => (
					<button
						key={useCase}
						onClick={() =>
							setSelectedUseCase(
								useCase as UseCaseKey
							)
						}
						className={`text-sm transition-colors cursor-pointer ${
							selectedUseCase === useCase
								? "text-white"
								: "text-gray-500 hover:text-gray-300"
						}`}
					>
						{useCase}
					</button>
				))}
			</div>

			{/* Use Case Info */}
			<div className="text-center text-gray-400 text-sm">
				{currentData.itemCount} items ({currentData.avgTokensPerItem} average tokens)
			</div>

			{/* Custom Prompt */}
			<div className="max-w-2xl mx-auto">
				<div className="bg-white/5 border border-white/10 rounded focus-within:border-white/15 transition-colors">
					<textarea
						value={customPrompt}
						onChange={(e) => setCustomPrompt(e.target.value)}
						placeholder="Enter filtering prompt to estimate tokens..."
						className="w-full h-16 px-4 py-3 bg-transparent border-0 text-white placeholder-gray-400 resize-none focus:outline-none text-sm"
					/>
					<div className="flex flex-wrap gap-2 px-4 pb-3">
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
			</div>

			{/* Model Selection */}
			<div className="flex flex-wrap gap-2 justify-center">
				{Object.entries(models).map(([modelKey, model]) => (
					<button
						key={modelKey}
						onClick={() =>
							setSelectedModel(modelKey as keyof typeof models)
						}
						className={`px-3 py-2 text-xs border rounded transition-colors cursor-pointer ${
							selectedModel === modelKey
								? "border-white/15 bg-white/5 text-gray-300"
								: "border-white/10 text-gray-500 hover:text-gray-400 hover:border-white/15"
						}`}
					>
						<div className="text-left">
							<div className="font-medium">{modelKey}</div>
							<div className="text-xs opacity-60 mt-0.5">
								${model.inputCost}/M • ${model.outputCost}/M
							</div>
						</div>
					</button>
				))}
			</div>

			{/* Variables */}
			<div className="flex flex-wrap gap-x-8 gap-y-4 text-xs justify-center text-gray-300" >
				<div >
					<InlineMath
						math={`\\text{items} = ${currentData.itemCount}`}
					/>
				</div>
				<div >
					<InlineMath
						math={`\\text{prompt\\_tokens} = ${estimatedCost.promptTokens}`}
					/>
				</div>
				<div >
					<InlineMath
						math={`\\text{avg\\_tokens} = ${currentData.avgTokensPerItem}`}
					/>
				</div>
				<div >
					<InlineMath
						math={`\\text{input\\_cost} = \\$${currentModel.inputCost}/1M`}
					/>
				</div>
				<div>
					<InlineMath
						math={`\\text{output\\_cost} = \\$${currentModel.outputCost}/1M`}
					/>
				</div>
			</div>

			{/* Formula */}
			<div className="text-center space-y-6 text-sm">
				<div className="text-gray-300">
					<InlineMath math="\text{max cost} = \text{items} \times (\text{input\_cost} \times (\text{prompt\_tokens} + \text{avg\_tokens}) + \text{output\_cost})" />
				</div>
				<div className="text-gray-300 text-base">
					<InlineMath
						math={`\\text{max cost} = \\$${estimatedCost.total.toFixed(
							6
						)}`}
					/>
				</div>
			</div>
		</div>
  );
}
