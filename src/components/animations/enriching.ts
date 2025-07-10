export interface EnrichingState {
  dotPositions: Array<{ x: number; y: number }>
  animationPhase: 'initial' | 'fadeOut' | 'fadeIn' | 'enriching-coarse' | 'enriching-fine'
  isInitialClick: boolean
}

export const generateFineHexLattice = (
  width: number,
  height: number,
  fineSpacing: number,
  fineRowCounts: number[]
) => {
  const dots: Array<{ x: number; y: number }> = []
  const rowHeight = fineSpacing * Math.sqrt(3) / 2
  const centerX = width / 2
  const centerY = height / 2
  
  fineRowCounts.forEach((count, rowIndex) => {
    const y = centerY + (rowIndex - Math.floor(fineRowCounts.length / 2)) * rowHeight
    const startX = centerX - (count - 1) * fineSpacing / 2
    
    for (let i = 0; i < count; i++) {
      const x = startX + i * fineSpacing
      dots.push({ x, y })
    }
  })
  
  return dots
}

export const getEnrichingFill = () => {
  return "rgba(255, 255, 255, 0.8)"
}

export const getEnrichingOpacity = (
  animationPhase: EnrichingState['animationPhase']
) => {
  if (animationPhase === 'fadeOut') return 0
  if (animationPhase === 'fadeIn') return 0
  return 1
}

export const getEnrichingTransition = (isInitialClick: boolean) => {
  return isInitialClick
    ? "cx 1.5s ease, cy 1.5s ease, opacity 1s ease, r 1s ease"
    : "cx 1.5s ease, cy 1.5s ease, opacity 1s ease, fill 1s ease, r 1s ease"
}

export const runEnrichingAnimation = (
  setAnimationPhase: (phase: EnrichingState['animationPhase']) => void,
  setShowProgress: (show: boolean) => void,
  setIsAnimating: (animating: boolean) => void,
  setDotPositions: (positions: Array<{ x: number; y: number }>) => void,
  setIsInitialClick: (initial: boolean) => void,
  setCircleRadius: (radius: number) => void,
  coarsePositions: Array<{ x: number; y: number }>,
  finePositions: Array<{ x: number; y: number }>
) => {
  setAnimationPhase('fadeOut')
  
  setTimeout(() => {
    setAnimationPhase('fadeIn')
    setIsInitialClick(true)
  }, 300)
  
  setTimeout(() => {
    setAnimationPhase('initial')
    setShowProgress(true)
    setIsInitialClick(false)
  }, 600)
  
  setTimeout(() => {
    setAnimationPhase('enriching-coarse')
  }, 1500)
  
  setTimeout(() => {
    // Transition to fine grid
    setDotPositions(finePositions)
    setCircleRadius(3)
    setAnimationPhase('enriching-fine')
  }, 3000)
  
  setTimeout(() => {
    setShowProgress(false)
    setIsAnimating(false)
  }, 4500)
}