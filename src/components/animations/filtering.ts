export interface FilteringState {
  selectedDots: Set<number>
  animationPhase: 'selected' | 'filtered' | 'reset' | 'fadeOut' | 'fadeIn' | 'initial'
}

export const centerHexagonDots = (rowCounts: number[]) => {
  const selected = new Set<number>()
  
  let dotIndex = 0
  rowCounts.forEach((count, rowIndex) => {
    if (rowIndex === 2) {
      selected.add(dotIndex + 2)
      selected.add(dotIndex + 3)
    } else if (rowIndex === 3) {
      selected.add(dotIndex + 2)
      selected.add(dotIndex + 3)
      selected.add(dotIndex + 4)
    } else if (rowIndex === 4) {
      selected.add(dotIndex + 2)
      selected.add(dotIndex + 3)
    }
    dotIndex += count
  })
  
  return selected
}

export const getFilteringFill = (
  animationPhase: FilteringState['animationPhase'],
  isSelected: boolean
) => {
  if (animationPhase === 'selected' && isSelected) return "white"
  if (animationPhase === 'filtered' && isSelected) return "white"
  return "hsl(var(--muted) / 0.1)"
}

export const getFilteringOpacity = (
  animationPhase: FilteringState['animationPhase'],
  isSelected: boolean
) => {
  if (animationPhase === 'fadeOut') return 0
  if (animationPhase === 'fadeIn') return 1
  if (animationPhase === 'filtered' && !isSelected) return 0
  if (animationPhase === 'reset') return 1
  return 1
}

export const runFilteringAnimation = (
  setAnimationPhase: (phase: FilteringState['animationPhase']) => void,
  setShowProgress: (show: boolean) => void,
  setIsAnimating: (animating: boolean) => void
) => {
  setAnimationPhase('fadeOut')
  
  setTimeout(() => {
    setAnimationPhase('fadeIn')
  }, 300)
  
  setTimeout(() => {
    setAnimationPhase('initial')
    setShowProgress(true)
  }, 600)
  
  setTimeout(() => {
    setAnimationPhase('selected')
  }, 1500)
  
  setTimeout(() => {
    setAnimationPhase('filtered')
  }, 3500)
  
  setTimeout(() => {
    setShowProgress(false)
    setAnimationPhase('selected')
    setIsAnimating(false)
  }, 4700)
}