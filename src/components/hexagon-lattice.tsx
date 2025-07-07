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
  onClick
}: HexagonLatticeProps) {
  const [selectedDots, setSelectedDots] = useState<Set<number>>(new Set())
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'selected' | 'filtered' | 'reset' | 'fadeOut' | 'fadeIn'>('selected')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  const centerHexagonDots = useMemo(() => {
    // Select center hexagon with sides of 2 dots
    const selected = new Set<number>()
    
    let dotIndex = 0
    rowCounts.forEach((count, rowIndex) => {
       if (rowIndex === 2) { // Row with 6 dots - select middle 4
        selected.add(dotIndex + 2) // 3rd dot
        selected.add(dotIndex + 3) // 4th dot
      } else if (rowIndex === 3) { // Row with 7 dots - select middle 5
        selected.add(dotIndex + 2) // 3rd dot
        selected.add(dotIndex + 3) // 4th dot (center)
        selected.add(dotIndex + 4) // 5th dot
      } else if (rowIndex === 4) { // Row with 6 dots - select middle 4
        selected.add(dotIndex + 2) // 3rd dot
        selected.add(dotIndex + 3) // 4th dot
      }
      dotIndex += count
    })
    
    return selected
  }, [rowCounts])

  useEffect(() => {
    // Set up thumbnail state - mid scene (white center, hollow outer)
    setSelectedDots(centerHexagonDots)
    setAnimationPhase('selected')
  }, []) // Run only once on mount

  const handleClick = () => {
    if (onClick) onClick()
    
    if (!isAnimating) {
      setIsAnimating(true)
      
      // Play animation: fadeOut -> fadeIn -> initial -> selected -> filtered -> selected
      setAnimationPhase('fadeOut')
      
      setTimeout(() => {
        setAnimationPhase('fadeIn')
      }, 300)
      
      // Start progress bar after fade in
      setTimeout(() => {
        setAnimationPhase('initial')
        setShowProgress(true)
      }, 600)
      
      setTimeout(() => {
        setAnimationPhase('selected')
      }, 1500)
      
      setTimeout(() => {
        setAnimationPhase('filtered')
      }, 2300)
      
      // End progress bar before returning to thumbnail
      setTimeout(() => {
        setShowProgress(false)
        setAnimationPhase('selected')
        setIsAnimating(false)
      }, 3700)
    }
  }
  const generateHexLattice = () => {
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
  }

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      onClick={handleClick}
      className="cursor-pointer"
    >
      {/* Progress bar */}
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
          transition: showProgress ? 'stroke-dashoffset 3.1s linear, opacity 0.3s ease' : 'opacity 0.3s ease',
          strokeDashoffset: showProgress ? "0" : "200"
        }}
      />
      
      {generateHexLattice().map((dot, index) => {
        const isSelected = selectedDots.has(index)
        const getFill = () => {
          if (!animateFilter) return "hsl(var(--muted) / 0.1)"
          if (animationPhase === 'selected' && isSelected) return "white"
          if (animationPhase === 'filtered' && isSelected) return "white"
          return "hsl(var(--muted) / 0.1)"
        }
        
        const getOpacity = () => {
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
              transition: 'fill 0.5s ease, opacity 0.5s ease'
            }}
          />
        )
      })}
    </svg>
  )
}
