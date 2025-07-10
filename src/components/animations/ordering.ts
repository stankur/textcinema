export interface OrderingState {
  dotPositions: Array<{ x: number; y: number }>
  dotOpacities: number[]
  animationPhase: 'initial' | 'fadeOut' | 'fadeIn' | 'ordering-random' | 'ordering-arranged'
  isInitialClick: boolean
}

export const generateLinearOpacities = (totalDots: number) => {
  return Array.from({ length: totalDots }, (_, i) => (i + 1) / totalDots)
}

export const generateArrangedOpacities = (linearOpacities: number[]) => {
  return [...linearOpacities].sort((a, b) => a - b)
}

export const getOrderingFill = (opacity: number) => {
  return `rgba(255, 255, 255, ${opacity})`
}

export const getOrderingOpacity = (
  animationPhase: OrderingState['animationPhase']
) => {
  if (animationPhase === 'fadeOut') return 0
  if (animationPhase === 'fadeIn') return 0
  return 1
}

export const getOrderingTransition = (isInitialClick: boolean) => {
  return isInitialClick
    ? "cx 1.5s ease, cy 1.5s ease, opacity 1s ease"
    : "cx 1.5s ease, cy 1.5s ease, opacity 1s ease, fill 1s ease"
}

export const runOrderingAnimation = (
  setAnimationPhase: (phase: OrderingState['animationPhase']) => void,
  setShowProgress: (show: boolean) => void,
  setIsAnimating: (animating: boolean) => void,
  setDotOpacities: (opacities: number[]) => void,
  setDotPositions: (positions: Array<{ x: number; y: number }>) => void,
  setIsInitialClick: (initial: boolean) => void,
  dotPositions: Array<{ x: number; y: number }>,
  generateLinearOpacities: number[],
  generateHexLattice: Array<{ x: number; y: number }>
) => {
  setAnimationPhase('fadeOut')
  
  setTimeout(() => {
    setDotOpacities(Array(dotPositions.length).fill(0.1))
    setAnimationPhase('fadeIn')
    setIsInitialClick(true)
  }, 300)
  
  setTimeout(() => {
    setAnimationPhase('initial')
    setShowProgress(true)
    setIsInitialClick(false)
  }, 600)
  
  let shuffledOpacitiesRef: number[]
  
  setTimeout(() => {
    shuffledOpacitiesRef = [...generateLinearOpacities].sort(() => Math.random() - 0.5)
    setDotOpacities(shuffledOpacitiesRef)
  }, 1500)
  
  setTimeout(() => {
    const indexToHexPosition = generateHexLattice
    const opacityWithIndex = shuffledOpacitiesRef.map((opacity, index) => ({ opacity, index }))
    opacityWithIndex.sort((a, b) => a.opacity - b.opacity)
    
    const newPositions = shuffledOpacitiesRef.map((_, dotIndex) => {
      const sortedIndex = opacityWithIndex.findIndex(item => item.index === dotIndex)
      return indexToHexPosition[sortedIndex]
    })
    
    setDotPositions(newPositions)
    setAnimationPhase('ordering-arranged')
  }, 3000)
  
  setTimeout(() => {
    setShowProgress(false)
    setIsAnimating(false)
  }, 4500)
}