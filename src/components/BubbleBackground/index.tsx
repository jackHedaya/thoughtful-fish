// Sourced from https://github.com/webdocgroup/Bubbles


import React, { useEffect, useRef } from 'react'
import Background from './core'

import s from '../../styles/components/bubble-background.module.scss'

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
  const { id = 'wd-floating-bubbles', color = 'black' } = props

  let resizeTimeout = null

  const ref = useRef()

  let background: Background

  /*
   * Initialises the core JS that controls the animation
   *
   */

  useEffect(() => {
    background = new Background(id, color)

    // Figure out resizing here

    // const resizeCanvas = flexCanvas(ref.current)
    // window.addEventListener('resize', resizeCanvas)
    // return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  return (
    <div id={s.container}>
      <div>
        <canvas
          id={id}
          ref={ref}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
          }}
        />
      </div>
    </div>
  )
}
