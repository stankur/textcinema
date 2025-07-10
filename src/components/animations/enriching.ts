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

export const generateThreeLayerLattice = (
  basePositions: Array<{ x: number; y: number }>,
  spacing: number = 25
) => {
  const allPositions: Array<{ x: number; y: number; color: string }> = []
  
  // Safety check
  if (!basePositions || !Array.isArray(basePositions)) {
    return allPositions
  }
  
  // Half neighboring lattice distance for hexagonal grid pattern
  const halfSpacing = spacing / 2
  const hexOffset = halfSpacing * Math.sqrt(3) / 2 // hexagonal vertical offset
  
  // Create three layers with hexagonal grid offsets
  basePositions.forEach((pos) => {
    // Cyan layer (stay in place)
    allPositions.push({
		x: pos.x - halfSpacing / 2,
		y: pos.y - hexOffset / 2,
		color: "rgba(0, 0, 0, 0.7)", // cyan
	});
    
    // Magenta layer (right horizontally)
    allPositions.push({
		x: pos.x + (halfSpacing / 2)  - halfSpacing / 2,
		y: pos.y - hexOffset / 2,
		color: "rgba(0, 0, 0, 0.7)", // magenta
	});
    
    // Yellow layer (right-up diagonally - hexagonal pattern)
    allPositions.push({
		x: pos.x + (halfSpacing / 4)  - (halfSpacing / 2) ,
		y: pos.y - (hexOffset / 2)  - (hexOffset / 2) ,
		color: "rgba(0, 0, 0, 0.7)", // yellow
	});
  })
  
  return allPositions
}

export const generateAlignedThreeLayerLattice = (
  basePositions: Array<{ x: number; y: number }>
) => {
  const allPositions: Array<{ x: number; y: number; color: string }> = []
  
  // Safety check
  if (!basePositions || !Array.isArray(basePositions)) {
    return allPositions
  }
  
  // Create three overlapping lattices with NO offset (all aligned)
  basePositions.forEach((pos) => {
    // All three layers at same position, very low opacity (0.1/3)
    allPositions.push({
      x: pos.x,
      y: pos.y,
      color: 'rgba(6, 182, 212, 0.033)' // very dark cyan (0.1/3)
    })
    
    allPositions.push({
      x: pos.x,
      y: pos.y,
      color: 'rgba(236, 72, 153, 0.033)' // very dark magenta (0.1/3)
    })
    
    allPositions.push({
      x: pos.x,
      y: pos.y,
      color: 'rgba(234, 179, 8, 0.033)' // very dark yellow (0.1/3)
    })
  })
  
  return allPositions
}

export const getEnrichingFill = (color?: string) => {
  return color || "rgba(255, 255, 255, 0.8)"
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
    ? ""  // No position animation on initial click, but include fill for opacity
    : "opacity 1s ease, r 1s ease, cx 1s ease, cy 1s ease, fill 1s ease"  // Position and opacity animation during splitting
}

export const runEnrichingAnimation = (
  setAnimationPhase: (phase: EnrichingState['animationPhase']) => void,
  setShowProgress: (show: boolean) => void,
  setIsAnimating: (animating: boolean) => void,
  setDotPositions: (positions: Array<{ x: number; y: number }>) => void,
  setDotColors: (colors: string[]) => void,
  setIsInitialClick: (initial: boolean) => void,
  setCircleRadius: (radius: number) => void,
  basePositions: Array<{ x: number; y: number }>
) => {
  setAnimationPhase('fadeOut')
  
  setTimeout(() => {
    // Start with aligned dark layers
    const alignedLayers = generateAlignedThreeLayerLattice(basePositions)
    setDotPositions(alignedLayers.map(p => ({ x: p.x, y: p.y })))
    setDotColors(alignedLayers.map(p => p.color))
    setCircleRadius(6)
    setAnimationPhase('fadeIn')
    setIsInitialClick(true)  // No position animation for initial setup
  }, 300)
  
  setTimeout(() => {
    setAnimationPhase('initial')
    setShowProgress(true)
    setIsInitialClick(false)  // Enable position animations for splitting
  }, 600)
  
  setTimeout(() => {
    setAnimationPhase('enriching-coarse')
  }, 1500)
  
  setTimeout(() => {
    // Split into offset layers with bright colors
    const offsetLayers = generateThreeLayerLattice(basePositions, 25) // Pass spacing parameter
    setDotPositions(offsetLayers.map(p => ({ x: p.x, y: p.y })))
    setDotColors(offsetLayers.map(p => p.color))
    setCircleRadius(4)
    setAnimationPhase('enriching-fine')
  }, 3000)
  
  setTimeout(() => {
    setShowProgress(false)
    setIsAnimating(false)
  }, 4500)
}
