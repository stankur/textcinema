"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  FilteringState, 
  centerHexagonDots, 
  getFilteringFill, 
  getFilteringOpacity, 
  runFilteringAnimation 
} from "./animations/filtering"
import { 
  OrderingState, 
  generateLinearOpacities, 
  generateArrangedOpacities, 
  getOrderingFill, 
  getOrderingOpacity, 
  getOrderingTransition, 
  runOrderingAnimation 
} from "./animations/ordering"
import { 
  ClusteringState, 
  getClusteringConfiguration, 
  getClusteringFill, 
  getClusteringOpacity, 
  getClusteringTransition, 
  runClusteringAnimation 
} from "./animations/clustering"
import { 
  EnrichingState, 
  generateFineHexLattice, 
  getEnrichingFill, 
  getEnrichingOpacity, 
  getEnrichingTransition, 
  runEnrichingAnimation 
} from "./animations/enriching"

interface HexagonLatticeProps {
  width?: number
  height?: number
  spacing?: number
  rowCounts?: number[]
  circleRadius?: number
  strokeWidth?: number
  animateFilter?: boolean
  animateOrdering?: boolean
  animateClustering?: boolean
  animateEnriching?: boolean
  onClick?: () => void
}

export default function HexagonLattice({
  width = 250,
  height = 250,
  spacing = 25,
  rowCounts = [4, 5, 6, 7, 6, 5, 4],
  circleRadius = 6,
  strokeWidth = 0.5,
  animateFilter = false,
  animateOrdering = false,
  animateClustering = false,
  animateEnriching = false,
  onClick
}: HexagonLatticeProps) {
  const [selectedDots, setSelectedDots] = useState<Set<number>>(new Set())
  const [animationPhase, setAnimationPhase] = useState<FilteringState['animationPhase'] | OrderingState['animationPhase'] | ClusteringState['animationPhase'] | EnrichingState['animationPhase']>('selected')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [dotPositions, setDotPositions] = useState<Array<{ x: number; y: number }>>([])
  const [dotOpacities, setDotOpacities] = useState<number[]>([])
  const [dotColors, setDotColors] = useState<string[]>([])
  const [isInitialClick, setIsInitialClick] = useState(true)
  const [currentCircleRadius, setCurrentCircleRadius] = useState(circleRadius)

  const generateHexLattice = useMemo(() => {
    const dots: Array<{ x: number; y: number }> = []
    const rowHeight = spacing * Math.sqrt(3) / 2
    const centerX = width / 2
    const centerY = height / 2
    
    rowCounts.forEach((count, rowIndex) => {
      const y = centerY + (rowIndex - Math.floor(rowCounts.length / 2)) * rowHeight
      const startX = centerX - (count - 1) * spacing / 2
      
      for (let i = 0; i < count; i++) {
        const x = startX + i * spacing
        dots.push({ x, y })
      }
    })
    
    return dots
  }, [width, height, spacing, rowCounts])

  const centerHexagonDotsSet = useMemo(() => {
    return centerHexagonDots(rowCounts)
  }, [rowCounts])

  const linearOpacities = useMemo(() => {
    return generateLinearOpacities(generateHexLattice.length)
  }, [generateHexLattice.length])

  const arrangedOpacities = useMemo(() => {
    return generateArrangedOpacities(linearOpacities)
  }, [linearOpacities])

  const clusteringConfiguration = useMemo(() => {
    return getClusteringConfiguration(generateHexLattice, rowCounts)
  }, [generateHexLattice, rowCounts])

  const fineHexLattice = useMemo(() => {
    const fineSpacing = spacing / 2
    const fineRowCounts = [8, 10, 12, 14, 12, 10, 8]
    return generateFineHexLattice(width, height, fineSpacing, fineRowCounts)
  }, [width, height, spacing])

  useEffect(() => {
    const latticePositions = generateHexLattice
    setDotPositions(latticePositions)
    
    if (animateOrdering) {
      setDotOpacities(arrangedOpacities)
      setAnimationPhase('ordering-arranged')
    } else if (animateClustering) {
      setDotColors(clusteringConfiguration)
      setAnimationPhase('clustering-arranged')
    } else if (animateEnriching) {
      setDotPositions(fineHexLattice)
      setCurrentCircleRadius(3)
      setAnimationPhase('enriching-fine')
    } else {
      setSelectedDots(centerHexagonDotsSet)
      setAnimationPhase('selected')
    }
  }, [animateOrdering, animateClustering, animateEnriching])

  const handleClick = () => {
    if (onClick) onClick()
    
    if (!isAnimating) {
      setIsAnimating(true)
      
      if (animateOrdering) {
        runOrderingAnimation(
          setAnimationPhase,
          setShowProgress,
          setIsAnimating,
          setDotOpacities,
          setDotPositions,
          setIsInitialClick,
          dotPositions,
          linearOpacities,
          generateHexLattice
        )
      } else if (animateClustering) {
        runClusteringAnimation(
          setAnimationPhase,
          setShowProgress,
          setIsAnimating,
          setDotColors,
          setDotPositions,
          setIsInitialClick,
          dotPositions,
          generateHexLattice,
          rowCounts
        )
      } else if (animateEnriching) {
        runEnrichingAnimation(
          setAnimationPhase,
          setShowProgress,
          setIsAnimating,
          setDotPositions,
          setIsInitialClick,
          setCurrentCircleRadius,
          generateHexLattice,
          fineHexLattice
        )
      } else {
        runFilteringAnimation(
          setAnimationPhase,
          setShowProgress,
          setIsAnimating,
          dotPositions
        )
      }
    }
  }

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      onClick={handleClick}
      className="cursor-pointer"
    >{ false && /* This is a placeholder for the progress line, currently not used */
      <line
        x1="40"
        y1="230"
        x2="210"
        y2="230"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
        strokeDasharray="170"
        strokeDashoffset="170"
        opacity={showProgress ? 1 : 0}
        style={{
          transition: showProgress ? 'stroke-dashoffset 4.1s linear, opacity 0.3s ease' : 'opacity 0.3s ease',
          strokeDashoffset: showProgress ? "0" : "170"
        }}
      />}
      
      {dotPositions.map((dot, index) => {
        const isSelected = selectedDots.has(index)
        const getFill = () => {
          if (animateOrdering) {
            const fillOpacity = dotOpacities[index] || 1
            return getOrderingFill(fillOpacity)
          }
          if (animateClustering) {
            return getClusteringFill(dotColors[index] || 'rgba(255, 255, 255, 0.1)')
          }
          if (animateEnriching) {
            return getEnrichingFill()
          }
          if (!animateFilter) return "hsl(var(--muted) / 0.1)"
          return getFilteringFill(animationPhase as FilteringState['animationPhase'], isSelected)
        }
        
        const getOpacity = () => {
          if (animateOrdering) {
            return getOrderingOpacity(animationPhase as OrderingState['animationPhase'])
          }
          if (animateClustering) {
            return getClusteringOpacity(animationPhase as ClusteringState['animationPhase'])
          }
          if (animateEnriching) {
            return getEnrichingOpacity(animationPhase as EnrichingState['animationPhase'])
          }
          if (!animateFilter) return 1
          return getFilteringOpacity(animationPhase as FilteringState['animationPhase'], isSelected)
        }
        
        const getTransition = () => {
          if (animateOrdering) {
            return getOrderingTransition(isInitialClick)
          }
          if (animateClustering) {
            return getClusteringTransition(isInitialClick)
          }
          if (animateEnriching) {
            return getEnrichingTransition(isInitialClick)
          }
          return "fill 0.5s ease, opacity 0.5s ease"
        }
        
        return (
			<circle
				key={index}
				cx={dot.x}
				cy={dot.y}
				r={currentCircleRadius}
				fill={getFill()}
				stroke="white"
				strokeWidth={strokeWidth}
				opacity={getOpacity()}
				style={{
					transition: getTransition(),
				}}
			/>
		);
      })}
    </svg>
  )
}
