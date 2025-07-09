"use client"

import { useState, useEffect, useMemo } from "react"

interface HexagonLatticeProps {
  width?: number
  height?: number
  spacing?: number
  rowCounts?: number[]
  circleRadius?: number
  strokeWidth?: number
  animateFilter?: boolean
  animateOrdering?: boolean
  onClick?: () => void
}

export default function HexagonLattice({
  width = 300,
  height = 300,
  spacing = 25,
  rowCounts = [4, 5, 6, 7, 6, 5, 4],
  circleRadius = 6,
  strokeWidth = 0.5,
  animateFilter = false,
  animateOrdering = false,
  onClick
}: HexagonLatticeProps) {
  const [selectedDots, setSelectedDots] = useState<Set<number>>(new Set())
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'selected' | 'filtered' | 'reset' | 'fadeOut' | 'fadeIn' | 'ordering-random' | 'ordering-arranged'>('selected')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [dotPositions, setDotPositions] = useState<Array<{ x: number; y: number }>>([])
  const [dotOpacities, setDotOpacities] = useState<number[]>([])
  const [isInitialClick, setIsInitialClick] = useState(true)

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

  const centerHexagonDots = useMemo(() => {
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
  }, [rowCounts])

  const generateLinearOpacities = useMemo(() => {
    return Array.from({ length: generateHexLattice.length }, (_, i) => (i + 1) / generateHexLattice.length)
  }, [generateHexLattice])

  const generateArrangedOpacities = useMemo(() => {
    return [...generateLinearOpacities].sort((a, b) => a - b)
  }, [generateLinearOpacities])

  useEffect(() => {
    const latticePositions = generateHexLattice
    setDotPositions(latticePositions)
    
    
    if (animateOrdering) {
      // Start with ordered arrangement as thumbnail
      setDotOpacities(generateArrangedOpacities)
      setAnimationPhase('ordering-arranged')
    } else {
      setSelectedDots(centerHexagonDots)
      setAnimationPhase('selected')
    }
  }, [animateOrdering])

  const handleClick = () => {
    if (onClick) onClick()
    
    if (!isAnimating) {
      setIsAnimating(true)
      
      if (animateOrdering) {
        // Start with fadeOut like filtering does
        setAnimationPhase('fadeOut')
        
        setTimeout(() => {
          // Set all dots dark before fade in
          setDotOpacities(Array(dotPositions.length).fill(0.1))
          setAnimationPhase('fadeIn')
          setIsInitialClick(true);

        }, 300)
        
        setTimeout(() => {
          setAnimationPhase('initial')
          setShowProgress(true)
          setIsInitialClick(false);
        }, 600)
        
        setTimeout(() => {
          // Create shuffled uniform percentages from 0% to 100%
          const shuffledOpacities = [...generateLinearOpacities].sort(() => Math.random() - 0.5)
          setDotOpacities(shuffledOpacities)
          
          // Also shuffle positions so dots start in random locations
          const shuffledPositions = [...generateHexLattice].sort(() => Math.random() - 0.5)
          setDotPositions(shuffledPositions)
        }, 1500)
        
        setTimeout(() => {
          // Sort dots by their opacity and rearrange positions accordingly
          const sortedByOpacity = dotOpacities
            .map((opacity, index) => ({ opacity, originalIndex: index }))
            .sort((a, b) => a.opacity - b.opacity)
          
          // Create new sorted opacities and positions arrays
          const newOpacities = sortedByOpacity.map(item => item.opacity)
          setDotOpacities(newOpacities)
          setDotPositions(generateHexLattice)
          setAnimationPhase('ordering-arranged')
        }, 3000)
        
        setTimeout(() => {
          setShowProgress(false)
          setIsAnimating(false)
        }, 4500)
      } else {
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
    }
  }

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <line
        x1="50"
        y1="30"
        x2="250"
        y2="30"
        stroke="white"
        strokeWidth="2"
        strokeDasharray="200"
        strokeDashoffset="200"
        opacity={showProgress ? 1 : 0}
        style={{
          transition: showProgress ? 'stroke-dashoffset 4.1s linear, opacity 0.3s ease' : 'opacity 0.3s ease',
          strokeDashoffset: showProgress ? "0" : "200"
        }}
      />
      
      {dotPositions.map((dot, index) => {
        const isSelected = selectedDots.has(index)
        const getFill = () => {
          if (animateOrdering) {
            const fillOpacity = dotOpacities[index] || 1
            return `rgba(255, 255, 255, ${fillOpacity})`
          }
          if (!animateFilter) return "hsl(var(--muted) / 0.1)"
          if (animationPhase === 'selected' && isSelected) return "white"
          if (animationPhase === 'filtered' && isSelected) return "white"
          return "hsl(var(--muted) / 0.1)"
        }
        
        const getOpacity = () => {
          if (animateOrdering) {
            if (animationPhase === 'fadeOut') return 0
            if (animationPhase === 'fadeIn') return 0
            return 1 // Keep stroke always visible during movement
          }
          if (!animateFilter) return 1
          if (animationPhase === 'fadeOut') return 0
          if (animationPhase === 'fadeIn') return 1
          if (animationPhase === 'filtered' && !isSelected) return 0
          if (animationPhase === 'reset') return 1
          return 1
        }
        
        return (
			<circle
				key={index}
				cx={dot.x}
				cy={dot.y}
				r={circleRadius}
				fill={getFill()}
				stroke="white"
				strokeWidth={strokeWidth}
				opacity={getOpacity()}
				style={{
					transition: animateOrdering
						? isInitialClick
							? "cx 1.5s ease, cy 1.5s ease, opacity 1s ease"
							: "cx 1.5s ease, cy 1.5s ease, opacity 1s ease, fill 1s ease"
						: "fill 0.5s ease, opacity 0.5s ease",
				}}
			/>
		);
      })}
    </svg>
  )
}
