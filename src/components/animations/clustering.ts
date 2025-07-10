export interface ClusteringState {
  dotPositions: Array<{ x: number; y: number }>
  dotColors: string[]
  animationPhase: 'initial' | 'fadeOut' | 'fadeIn' | 'clustering-random' | 'clustering-arranged'
  isInitialClick: boolean
}

export type ClusterColor = 'white' | 'cyan' | 'magenta' | 'yellow'

export const clusterColors: Record<ClusterColor, string> = {
  white: 'rgba(255, 255, 255, 0.1)',
  cyan: 'rgba(6, 182, 212, 0.8)',     // cyan-500 
  magenta: 'rgba(236, 72, 153, 0.8)', // pink-500 (magenta)
  yellow: 'rgba(234, 179, 8, 0.8)'    // yellow-500
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

export const getClusteringConfiguration = (
  generateHexLattice: Array<{ x: number; y: number }>,
  rowCounts: number[]
) => {
  const centerDots = centerHexagonDots(rowCounts)
  const colors: string[] = new Array(generateHexLattice.length)
  
  // Assign white to center hexagon
  centerDots.forEach(index => {
    colors[index] = clusterColors.white
  })
  
  // Get outer dots by ray structure
  // For rowCounts = [4, 5, 6, 7, 6, 5, 4], we need to identify rays
  let dotIndex = 0
  
  // Row 0: [4] - top row
  for (let i = 0; i < 4; i++) {
    if (i === 0) colors[dotIndex] = clusterColors.cyan      
    else if (i === 1) colors[dotIndex] = clusterColors.magenta
    else if (i === 2) colors[dotIndex] = clusterColors.magenta
    else colors[dotIndex] = clusterColors.magenta
    dotIndex++
  }
  
  // Row 1: [5] 
  for (let i = 0; i < 5; i++) {
    if (i === 0) colors[dotIndex] = clusterColors.cyan      // left ray
    else if (i === 1) colors[dotIndex] = clusterColors.cyan // left ray
    else if (i === 2) colors[dotIndex] = clusterColors.magenta // center (skip)
    else if (i === 3) colors[dotIndex] = clusterColors.magenta // right ray
    else colors[dotIndex] = clusterColors.magenta             // right ray
    dotIndex++
  }
  
  // Row 2: [6] - contains some center dots
  for (let i = 0; i < 6; i++) {
    if (i === 0) colors[dotIndex] = clusterColors.cyan      // left ray
    else if (i === 1) colors[dotIndex] = clusterColors.cyan // left ray
    else if (i === 2 || i === 3) colors[dotIndex] = clusterColors.white // center dots
    else if (i === 4) colors[dotIndex] = clusterColors.magenta // right ray
    else colors[dotIndex] = clusterColors.magenta             // right ray
    dotIndex++
  }
  
  // Row 3: [7] - center row with center dots
  for (let i = 0; i < 7; i++) {
    if (i === 0) colors[dotIndex] = clusterColors.cyan      // left ray
    else if (i === 1) colors[dotIndex] = clusterColors.cyan // left ray
    else if (i >= 2 && i <= 4) colors[dotIndex] = clusterColors.white // center dots
    else if (i === 5) colors[dotIndex] = clusterColors.magenta // right ray
    else colors[dotIndex] = clusterColors.magenta             // right ray
    dotIndex++
  }
  
  // Row 4: [6] - contains some center dots
  for (let i = 0; i < 6; i++) {
    if (i === 0) colors[dotIndex] = clusterColors.cyan      // left ray
    else if (i === 1) colors[dotIndex] = clusterColors.cyan // left ray
    else if (i === 2 || i === 3) colors[dotIndex] = clusterColors.white // center dots
    else if (i === 4) colors[dotIndex] = clusterColors.yellow 
    else colors[dotIndex] = clusterColors.yellow             
    dotIndex++
  }
  
  // Row 5: [5]
  for (let i = 0; i < 5; i++) {
    if (i === 0) colors[dotIndex] = clusterColors.cyan    // bottom-left ray
    else if (i === 1) colors[dotIndex] = clusterColors.yellow // bottom-left ray
    else if (i === 2) colors[dotIndex] = clusterColors.yellow
    else if (i === 3) colors[dotIndex] = clusterColors.yellow // bottom-right ray
    else colors[dotIndex] = clusterColors.yellow           // bottom-right ray
    dotIndex++
  }
  
  // Row 6: [4] - bottom row
  for (let i = 0; i < 4; i++) {
    if (i === 0) colors[dotIndex] = clusterColors.yellow    // bottom-left ray
    else if (i === 1) colors[dotIndex] = clusterColors.yellow // bottom-left ray
    else if (i === 2) colors[dotIndex] = clusterColors.yellow // bottom-right ray
    else colors[dotIndex] = clusterColors.yellow           // bottom-right ray
    dotIndex++
  }
  
  return colors
}

export const generateRandomColors = (
  _generateHexLattice: Array<{ x: number; y: number }>,
  rowCounts: number[]
) => {
  const centerDots = centerHexagonDots(rowCounts)
  
  // Each color should have exactly 10 dots
  const colorCounts = {
    white: centerDots.size,      // 7 dots
    cyan: 10,
    magenta: 10,
    yellow: 10
  }
  
  // Create array with correct counts
  const colorArray: string[] = []
  Object.entries(colorCounts).forEach(([color, count]) => {
    for (let i = 0; i < count; i++) {
      colorArray.push(clusterColors[color as ClusterColor])
    }
  })
  
  // Shuffle and return
  return colorArray.sort(() => Math.random() - 0.5)
}

export const getClusteringFill = (color: string) => {
  return color
}

export const getClusteringOpacity = (
  animationPhase: ClusteringState['animationPhase']
) => {
  if (animationPhase === 'fadeOut') return 0
  if (animationPhase === 'fadeIn') return 0
  return 1
}

export const getClusteringTransition = (isInitialClick: boolean) => {
  return isInitialClick
    ? "cx 1.5s ease, cy 1.5s ease, opacity 1s ease"
    : "cx 1.5s ease, cy 1.5s ease, opacity 1s ease, fill 1s ease"
}

export const runClusteringAnimation = (
  setAnimationPhase: (phase: ClusteringState['animationPhase']) => void,
  setShowProgress: (show: boolean) => void,
  setIsAnimating: (animating: boolean) => void,
  setDotColors: (colors: string[]) => void,
  setDotPositions: (positions: Array<{ x: number; y: number }>) => void,
  setIsInitialClick: (initial: boolean) => void,
  dotPositions: Array<{ x: number; y: number }>,
  generateHexLattice: Array<{ x: number; y: number }>,
  rowCounts: number[]
) => {
  setAnimationPhase('fadeOut')
  
  setTimeout(() => {
    setDotColors(Array(dotPositions.length).fill(clusterColors.white))
    setAnimationPhase('fadeIn')
    setIsInitialClick(true)
  }, 300)
  
  setTimeout(() => {
    setAnimationPhase('initial')
    setShowProgress(true)
    setIsInitialClick(false)
  }, 600)
  
  let shuffledColorsRef: string[]
  
  setTimeout(() => {
    shuffledColorsRef = generateRandomColors(generateHexLattice, rowCounts)
    setDotColors(shuffledColorsRef)
  }, 1500)
  
  setTimeout(() => {
    const targetConfiguration = getClusteringConfiguration(generateHexLattice, rowCounts)
    const colorToIndices: Record<string, number[]> = {}
    
    // Group target positions by color
    targetConfiguration.forEach((color, index) => {
      if (!colorToIndices[color]) colorToIndices[color] = []
      colorToIndices[color].push(index)
    })
    
    // Group current dots by color
    const currentColorToIndices: Record<string, number[]> = {}
    shuffledColorsRef.forEach((color, index) => {
      if (!currentColorToIndices[color]) currentColorToIndices[color] = []
      currentColorToIndices[color].push(index)
    })
    
    // Create new positions mapping
    const newPositions = [...dotPositions]
    Object.entries(currentColorToIndices).forEach(([color, currentIndices]) => {
      const targetIndices = colorToIndices[color] || []
      currentIndices.forEach((currentIndex, i) => {
        if (targetIndices[i] !== undefined) {
          newPositions[currentIndex] = generateHexLattice[targetIndices[i]]
        }
      })
    })
    
    setDotPositions(newPositions)
    setAnimationPhase('clustering-arranged')
  }, 3000)
  
  setTimeout(() => {
    setShowProgress(false)
    setIsAnimating(false)
  }, 4500)
}
