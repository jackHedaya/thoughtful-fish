// Core
import React, { useEffect } from 'react'
import initAnimation from './core'

type BubbleBackgroundProps = {
  /**
   * Gives the bubble canvas a unique id. This will be necessary if you need more than one canvas on the page
   */
  id?: string

  /**
   * The color used for the bubbles
   * @example <BubbleBackground color="0,0,0" />
   */
  color?: string
}

export default function BubbleBackground(props: BubbleBackgroundProps) {
  const { id = 'wd-floating-bubbles', color = '0,0,0' } = props

  let resizeTimeout = null

  /*
   * Initialises the core JS that controls the animation
   *
   */
  const init = () => {
    if (resizeTimeout) return

    resizeTimeout = setTimeout(() => {
      initAnimation(id, color)

      resizeTimeout = null
    }, 5000)
  }

  useEffect(() => {
    init()

    window.addEventListener('resize', init)

    return () => window.removeEventListener('resize', init)
  }, [])

  return (
    <canvas
      id={id}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    />
  )
}
